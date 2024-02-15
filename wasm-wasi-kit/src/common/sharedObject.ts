/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
/// <reference path="../../typings/webAssemblyCommon.d.ts" />
import RAL from './ral';

import * as uuid from 'uuid';

import {
	Memory, ReadonlyMemoryRange, Alignment, ComponentModelContext, ResourceManagers, ptr, u32, size, JType as _JType,
	MemoryError, MemoryRange, type offset, ComponentModelTrap, type BaseMemoryRange
} from '@vscode/wasm-component-model';

export interface SharedMemory extends Memory {
	id: string;
	free(range: MemoryRange): void;
	isSame(memory: SharedMemory): boolean;
	getTransferable(): SharedMemory.Transferable;
	copyWithin(dest: MemoryRange, src: ReadonlyMemoryRange): void;
}

export namespace SharedMemory {

	export type Transferable = {
		id: string;
		module: WebAssembly.Module;
		memory: WebAssembly.Memory;
	};
	export interface Exports {
		malloc(size: number): number;
		free(ptr: number): void;
		aligned_alloc(align: number, size: number): number;
	}

	export function is(value: any): value is SharedMemory {
		return value instanceof MemoryImpl;
	}

	export function create(): Promise<SharedMemory> {
		return RAL().Memory.create(MemoryImpl);
	}

	export function createFrom(transferable: SharedMemory.Transferable): Promise<SharedMemory> {
		return RAL().Memory.createFrom(MemoryImpl, transferable);
	}
}

class MemoryImpl implements SharedMemory {

	public readonly id: string;

	private readonly module: WebAssembly.Module;
	private readonly memory: WebAssembly.Memory;
	private readonly exports: SharedMemory.Exports;

	private _raw: Uint8Array | undefined;
	private _view: DataView | undefined;

	public constructor(module: WebAssembly.Module, memory: WebAssembly.Memory, exports: SharedMemory.Exports, id?: string) {
		this.id = id ?? uuid.v4();
		this.module = module;
		this.memory = memory;
		this.exports = exports;
	}

	public isSame(memory: SharedMemory): boolean {
		return this.buffer === memory.buffer;
	}

	public getTransferable(): SharedMemory.Transferable {
		return { id: this.id, module: this.module, memory: this.memory };
	}

	public get buffer(): ArrayBuffer {
		return this.memory.buffer;
	}

	public get raw(): Uint8Array {
		if (this._raw === undefined || this._raw.buffer !== this.memory.buffer) {
			this._raw = new Uint8Array(this.memory.buffer);
		}
		return this._raw;
	}

	public get view(): DataView {
		if (this._view === undefined || this._view.buffer !== this.memory.buffer) {
			this._view = new DataView(this.memory.buffer);
		}
		return this._view;
	}

	public alloc(align: Alignment, size: size): MemoryRange {
		try {
			const ptr = this.exports.aligned_alloc(align, size);
			if (ptr === 0) {
				throw new Error('Allocation failed');
			}
			const result = new MemoryRange(this, ptr, size);
			result.getUint8View(0).fill(0);
			return result;
		} catch (error) {
			RAL().console.error(`Alloc [${align}, ${size}] failed. Buffer size: ${this.memory.buffer.byteLength}`);
			throw error;
		}
	}

	public realloc(_range: MemoryRange, _align: Alignment, _newSize: size): MemoryRange {
		throw new Error('Not implemented');
	}

	public preAllocated(ptr: number, size: number): MemoryRange {
		if (ptr + size > this.buffer.byteLength) {
			throw new MemoryError(`Memory access is out of bounds. Accessing [${ptr}, ${size}], allocated[${0},${this.buffer.byteLength}]`);
		}
		return new MemoryRange(this, ptr, size, true);
	}

	public free(range: MemoryRange): void {
		try {
			this.exports.free(range.ptr);
		} catch (error) {
			RAL().console.error(`Free ptr ${ptr} failed. Buffer size: ${this.memory.buffer.byteLength}`);
			throw error;
		}
	}

	public readonly(ptr: ptr, size: size): ReadonlyMemoryRange {
		if (ptr + size > this.buffer.byteLength) {
			throw new MemoryError(`Memory access is out of bounds. Accessing [${ptr}, ${size}], allocated[${0},${this.buffer.byteLength}]`);
		}
		return new ReadonlyMemoryRange(this, ptr, size);
	}

	public copyWithin(dest: MemoryRange, src: ReadonlyMemoryRange): void {
		const raw = new Uint8Array(this.buffer);
		raw.copyWithin(dest.ptr, src.ptr, src.ptr + src.size);
	}
}

export type MemoryLocation = {
	memory: {
		id: string;
	};
	ptr: ptr;
	size: u32;
};
export namespace MemoryLocation {
	export function from(memRange: BaseMemoryRange): MemoryLocation {
		return {
			memory: {
				id: memRange.memory.id
			},
			ptr: memRange.ptr,
			size: memRange.size
		};
	}
	export function to(memory: SharedMemory, location: MemoryLocation): MemoryRange {
		if (memory.id !== location.memory.id) {
			throw new MemoryError(`Memory location does not match`);
		}
		return memory.preAllocated(location.ptr, location.size);
	}
}


export class Allocation {

	private readonly memory: SharedMemory;
	private readonly align: Alignment;
	private readonly size: size;

	constructor(memory: SharedMemory, align: Alignment, size: size) {
		this.memory = memory;
		this.align = align;
		this.size = size;
	}

	public alloc(): MemoryRange {
		return this.memory.alloc(this.align, this.size);
	}
}

export class ConcurrentModificationError extends Error {
	constructor(message: string) {
		super(message);
	}
}

export type SharedObjectLocation = {
	memory: {
		id: string;
	};
	id: u32;
	ptr: ptr;
	size: size;
};

export namespace SharedObjectContext {
	export enum Mode {
		new = 'new',
		existing = 'existing',
	}
}
export interface SharedObjectContext extends ComponentModelContext {
	mode: SharedObjectContext.Mode;
}

export interface BasePropertyType {
	readonly size: size;
	readonly alignment: Alignment;
}

export abstract class ObjectType<T = any> implements BasePropertyType {
	public abstract readonly size: size;
	public abstract readonly alignment: Alignment;
	public abstract load(memory: MemoryRange, offset: offset, context: ComponentModelContext): T;
}

export interface ValueType<T = any> extends BasePropertyType {
	load(memory: ReadonlyMemoryRange, offset: offset, context: ComponentModelContext): T;
	store(memory: MemoryRange, offset: offset, value: T, context: ComponentModelContext): void;
}
export namespace ValueType {
	namespace $MemoryRange {
		export const size: size = ptr.size + u32.size;
		export const alignment: Alignment = Math.max(ptr.alignment, u32.alignment);

		export function load(memRange: ReadonlyMemoryRange, offset: number): MemoryRange {
			return memRange.memory.preAllocated(memRange.getUint32(offset), memRange.getUint32(offset + ptr.size));
		}

		export function store(memory: MemoryRange, offset: number, value: MemoryRange): void {
			memory.setUint32(offset, value.ptr);
			memory.setUint32(offset + ptr.size, value.size);
		}
	}
	export const MemoryRange: ValueType<MemoryRange> = $MemoryRange;

	namespace $ReadonlyMemoryRange {
		export const size: size = ptr.size + u32.size;
		export const alignment: Alignment = Math.max(ptr.alignment, u32.alignment);

		export function load(memRange: ReadonlyMemoryRange, offset: number): ReadonlyMemoryRange {
			return memRange.memory.readonly(memRange.getUint32(offset), memRange.getUint32(offset + ptr.size));
		}

		export function store(memory: MemoryRange, offset: number, value: ReadonlyMemoryRange): void {
			memory.setUint32(offset, value.ptr);
			memory.setUint32(offset + ptr.size, value.size);
		}
	}
	export const ReadonlyMemoryRange: ValueType<ReadonlyMemoryRange> = $ReadonlyMemoryRange;
}
export type PropertyType<T = any> = ObjectType<T> | ValueType<T>;


export namespace Record {
	type RecordProperties = { [key: string]: any };
	export type Properties = [string, PropertyType][];
	export namespace Type {
		export type FieldInfo = { type: PropertyType; offset: number };
	}
	export class Type<T extends RecordProperties> extends ObjectType<T> {
		public readonly alignment: Alignment;
		public readonly size: size;
		private readonly fields: Map<string, Type.FieldInfo>;

		constructor(...props: Properties[]) {
			super();
			let properties: Properties =  props.length === 0 ? [] : props.length === 1 ? props[0] : props.reduce((r, p) => r.concat(p), []);
			let alignment: Alignment = Alignment.byte;
			let size = 0;
			const fields = Object.create(null);
			const fieldsMap: Map<string, { type: PropertyType; offset: number }> = new Map();
			for (const [name, type] of properties) {
				if (fieldsMap.has(name)) {
					throw new ComponentModelTrap(`Duplicate property ${name}`);
				}
				alignment = Math.max(alignment, type.alignment);
				size = Alignment.align(size, type.alignment);
				const info = { offset: size, type };
				fieldsMap.set(name, info);
				fields[name] = info;
				size = size + type.size;
			}
			this.alignment = alignment;
			this.size = size;
			this.fields = fieldsMap;
		}

		getField(name: string): Type.FieldInfo| undefined {
			return this.fields.get(name);
		}

		hasField(name: string): boolean {
			return this.fields.has(name);
		}

		load(memory: MemoryRange, offset: offset, context: SharedObjectContext): T {
			memory.assertAlignment(offset, this.alignment);
			const result = Object.create(null);
			for (const [name, fieldInfo] of this.fields) {
				const type = fieldInfo.type;
				if (type instanceof ObjectType) {
					let result: any;
					Object.defineProperty(result, name, {
						get() {
							if (result === undefined) {
								result = type.load(memory, offset + fieldInfo.offset, context);
							}
							return result;
						}
						// We need to think about how to handle a set. Best would be to copy the new object into the memory.
					});
				} else {
					Object.defineProperty(result, name, {
						get() {
							return type.load(memory, offset + fieldInfo.offset, context);
						},
						set(value) {
							type.store(memory, offset + fieldInfo.offset, value, context);
						}
					});
				}
			}
			return result as T;
		}
	}
}

export abstract class ObjectProperty {

	protected readonly memoryRange: MemoryRange;

	constructor(memoryRange: MemoryRange) {
		this.memoryRange = memoryRange;
	}

	protected get memory(): SharedMemory {
		const result = this.memoryRange.memory;
		if (!SharedMemory.is(result)) {
			throw new ComponentModelTrap(`Memory is not a shared memory instance.`);
		}
		return result;
	}

	public getMemoryLocation(): MemoryLocation {
		return MemoryLocation.from(this.memoryRange);
	}
}

export class Lock extends ObjectProperty{

	private readonly buffer: Int32Array;
	private lockCount: number;

	constructor(memory: SharedMemory);
	constructor(memRange: MemoryRange, context?: SharedObjectContext);
	constructor(arg: SharedMemory | MemoryRange, context?: SharedObjectContext) {
		const isMemory = SharedMemory.is(arg);
		super(isMemory ? Lock.alloc(arg) : arg);
		this.buffer = this.memoryRange.getInt32View(0, 1);
		if (isMemory || context?.mode === SharedObjectContext.Mode.new) {
			Atomics.store(this.buffer, 0, 1);
		}
		this.lockCount = 0;
	}

	public acquire(): void {
		// We already have a lock.
		if (this.lockCount > 0) {
			this.lockCount++;
			return;
		}
		while (true) {
			const value = Atomics.load(this.buffer, 0);
			if (value > 0 && Atomics.compareExchange(this.buffer, 0, value, value - 1) === value) {
				this.lockCount = 1;
				return;
			}
			Atomics.wait(this.buffer, 0, value);
		}
	}

	public release(): void {
		if (this.lockCount > 1) {
			this.lockCount--;
			return;
		}
		Atomics.add(this.buffer, 0, 1);
		Atomics.notify(this.buffer, 0, 1);
		this.lockCount = 0;
	}

}
export namespace Lock {

	class $Type extends ObjectType<Lock> {
		public readonly alignment: Alignment = u32.alignment;
		public readonly size: size = u32.size;
		public load(memory: MemoryRange, offset: offset, context: SharedObjectContext): Lock {
			memory.assertAlignment(offset, this.alignment);
			return new Lock(memory.range(offset, this.size), context);
		}
	}
	export const Type = new $Type();

	export function alloc(memory: SharedMemory): MemoryRange {
		return memory.alloc(Type.alignment, Type.size);
	}
}

export class Signal extends ObjectProperty {

	private readonly buffer: Int32Array;

	constructor(memory: SharedMemory);
	constructor(memRange: MemoryRange, context?: SharedObjectContext);
	constructor(arg: SharedMemory | MemoryRange, context?: SharedObjectContext) {
		const isMemory = SharedMemory.is(arg);
		super(isMemory ? Signal.alloc(arg) : arg);
		this.buffer = this.memoryRange.getInt32View(0, 1);
		if (isMemory || context?.mode === SharedObjectContext.Mode.new) {
			Atomics.store(this.buffer, 0, 0);
		}
	}

	public wait(): void {
		const result = Atomics.wait(this.buffer, 0, 0);
		if (result === 'timed-out') {
			throw new Error(`timed-out should never happen.`);
		} else if (result === 'not-equal') {
			const value = Atomics.load(this.buffer, 0);
			if (value !== 1) {
				throw new Error(`Unexpected signal value ${value}`);
			}
		}
	}

	public waitAsync(): Promise<void> | void {
		const p = Atomics.waitAsync(this.buffer, 0, 0);
		if (p.async === false) {
			if (p.value === 'timed-out') {
				throw new Error(`timed-out should never happen.`);
			} else if (p.value === 'not-equal') {
				const value = Atomics.load(this.buffer, 0);
				if (value !== 1) {
					throw new Error(`Unexpected signal value ${value}`);
				}
			}
		} else {
			return p.value.then((result) => {
				if (result === 'timed-out') {
					throw new Error(`timed-out should never happen.`);
				}
			});
		}
	}

	public isResolved(): boolean {
		return Atomics.load(this.buffer, 0) === 1;
	}

	public resolve(agentsToNotify?: number | undefined): void {
		Atomics.store(this.buffer, 0, 1);
		Atomics.notify(this.buffer, 0, agentsToNotify);
	}
}

export namespace Signal {
	class $Type extends ObjectType<Signal> {
		public readonly alignment: Alignment = u32.alignment;
		public readonly size: size = u32.size;
		public load(memory: MemoryRange, offset: offset, context: SharedObjectContext): Signal {
			memory.assertAlignment(offset, this.alignment);
			return new Signal(memory.range(offset, this.size), context);
		}
	}
	export const Type = new $Type();

	export function alloc(memory: SharedMemory): MemoryRange {
		return memory.alloc(Type.alignment, Type.size);
	}
}

export namespace SharedObject {
	export type Properties = {
		_size: size;
		_id: u32;
		_lock: Lock;
	};
}
export abstract class SharedObject<T extends SharedObject.Properties = SharedObject.Properties> {

	public static Context = {
		new: {
			options: { encoding: 'utf-8' },
			managers: ResourceManagers.createDefault(),
			mode: SharedObjectContext.Mode.new
		} satisfies SharedObjectContext,
		existing: {
			options: { encoding: 'utf-8' },
			managers: ResourceManagers.createDefault(),
			mode: SharedObjectContext.Mode.existing
		} satisfies SharedObjectContext
	};

	public static properties: Record.Properties = [
		['_size', u32],
		['_id', u32],
		['_lock', Lock.Type]
	];

	protected readonly memoryRange: MemoryRange;
	protected readonly access: T;
	private readonly lock: Lock;

	protected constructor(type: Record.Type<T>, memoryOrLocation: SharedMemory | MemoryRange) {
		let context: SharedObjectContext;
		if (memoryOrLocation instanceof MemoryRange) {
			if (memoryOrLocation.size !== type.size) {
				throw new ComponentModelTrap(`Allocated memory[${memoryOrLocation.ptr},${memoryOrLocation.size}] doesn't match the record size[${type.size}].`);
			}
			this.memoryRange = memoryOrLocation;
			context = SharedObject.Context.existing;
		} else if (SharedMemory.is(memoryOrLocation)) {
			this.memoryRange = memoryOrLocation.alloc(type.alignment, type.size);
			context = SharedObject.Context.new;
		} else {
			throw new ComponentModelTrap(`Invalid memory or location.`);
		}
		this.access = type.load(this.memoryRange, 0, context);
		this.lock = this.access._lock;
	}

	public free(): void {
		if (!this.memoryRange.isAllocated) {
			// We should think about a trace when we dispose
			// a shared object from a thread that hasn't allocated it.
		}
		this.memoryRange.free();
	}

	protected get memory(): SharedMemory {
		const result = this.memoryRange.memory;
		if (!(result instanceof MemoryImpl)) {
			throw new Error(`Memory is not a shared memory instance`);
		}
		return result as SharedMemory;
	}

	protected abstract getRecordType(): Record.Type<T>;

	public runLocked(callback: (value: this) => void): void {
		this.acquireLock();
		try {
			callback(this);
		} finally {
			this.releaseLock();
		}
	}

	protected acquireLock(): void {
		this.lock.acquire();
	}

	protected releaseLock(): void {
		this.lock.release();
	}
}

export namespace Synchronize {
	export type WithRunLocked<T> = T & {
		runLocked(callback: (value: T) => void): void;
	};
}
export function Synchronize<T extends ObjectProperty>(memoryOrLock: SharedMemory | Lock, object: T): Synchronize.WithRunLocked<T> {
	const lock = memoryOrLock instanceof Lock ? memoryOrLock : new Lock(memoryOrLock);
	function runLocked(target: T, callback: (value: T) => void): void {
		lock.acquire();
		try {
			callback(target);
		} finally {
			lock.release();
		}
	}
	function func(target: T, p: PropertyKey, ...args: any[]): any {
		try {
			lock.acquire();
			return (target as any)[p](...args);
		} finally {
			lock.release();
		}
	}
	function isPropertyOrGetter(target: any, p: PropertyKey): boolean {
		if (Object.hasOwn(target, p)) {
			return true;
		}
		const prototype = Reflect.getPrototypeOf(target);
		const descriptor = prototype !== null ? Reflect.getOwnPropertyDescriptor(prototype, p) : Reflect.getOwnPropertyDescriptor(target, p);
		if (descriptor !== undefined && descriptor.get !== undefined) {
			return true;
		}
		return false;
	}

	function isPropertyOrSetter(target: any, p: PropertyKey): boolean {
		if (Object.hasOwn(target, p)) {
			return true;
		}
		const prototype = Reflect.getPrototypeOf(target);
		const descriptor = prototype !== null ? Reflect.getOwnPropertyDescriptor(prototype, p) : Reflect.getOwnPropertyDescriptor(target, p);
		if (descriptor !== undefined && descriptor.set !== undefined) {
			return true;
		}
		return false;
	}
	return new Proxy<T & { runLocked(callback: (value: T) => void): void }>(object as any, {
		get(target: T, p: PropertyKey, receiver: any): any {
			if (p === 'runLocked') {
				return runLocked.bind(null, target);
			}
			if (isPropertyOrGetter(target, p)) {
				try {
					lock.acquire();
					return (target as any)[p];
				} finally {
					lock.release();
				}
			} else {
				const value = Reflect.get(target, p, receiver);
				if (typeof value === 'function') {
					return func.bind(null, target, p);
				}
			}
		},
		set(target: T, p: PropertyKey, value: any, _receiver: any): boolean {
			if (isPropertyOrSetter(target, p)) {
				try {
					lock.acquire();
					(target as any)[p] = value;
				} finally {
					lock.release();
				}
				return true;
			}
			return false;
		}
	});
}