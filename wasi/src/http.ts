/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as $wcm from '@vscode/wasm-component-model';
import type { u16, u8, u32, u64, result, own, borrow, option, i32, ptr, i64 } from '@vscode/wasm-component-model';
import { io } from './io';
import { clocks } from './clocks';

export namespace http {
	/**
	 * This interface defines all of the types and methods for implementing
	 * HTTP Requests and Responses, both incoming and outgoing, as well as
	 * their headers, trailers, and bodies.
	 */
	export namespace Types {

		export type Duration = clocks.MonotonicClock.Duration;

		export type InputStream = io.Streams.InputStream;

		export type OutputStream = io.Streams.OutputStream;

		export type IoError = io.Error.Error;

		export type Pollable = io.Poll.Pollable;


		/**
		 * This type corresponds to HTTP standard Methods.
		 */
		export namespace Method {
			export const get = 'get' as const;
			export type Get = { readonly tag: typeof get } & _common;
			export function Get(): Get {
				return new VariantImpl(get, undefined) as Get;
			}

			export const head = 'head' as const;
			export type Head = { readonly tag: typeof head } & _common;
			export function Head(): Head {
				return new VariantImpl(head, undefined) as Head;
			}

			export const post = 'post' as const;
			export type Post = { readonly tag: typeof post } & _common;
			export function Post(): Post {
				return new VariantImpl(post, undefined) as Post;
			}

			export const put = 'put' as const;
			export type Put = { readonly tag: typeof put } & _common;
			export function Put(): Put {
				return new VariantImpl(put, undefined) as Put;
			}

			export const delete_ = 'delete' as const;
			export type Delete = { readonly tag: typeof delete_ } & _common;
			export function Delete(): Delete {
				return new VariantImpl(delete_, undefined) as Delete;
			}

			export const connect = 'connect' as const;
			export type Connect = { readonly tag: typeof connect } & _common;
			export function Connect(): Connect {
				return new VariantImpl(connect, undefined) as Connect;
			}

			export const options = 'options' as const;
			export type Options = { readonly tag: typeof options } & _common;
			export function Options(): Options {
				return new VariantImpl(options, undefined) as Options;
			}

			export const trace = 'trace' as const;
			export type Trace = { readonly tag: typeof trace } & _common;
			export function Trace(): Trace {
				return new VariantImpl(trace, undefined) as Trace;
			}

			export const patch = 'patch' as const;
			export type Patch = { readonly tag: typeof patch } & _common;
			export function Patch(): Patch {
				return new VariantImpl(patch, undefined) as Patch;
			}

			export const other = 'other' as const;
			export type Other = { readonly tag: typeof other; readonly value: string } & _common;
			export function Other(value: string): Other {
				return new VariantImpl(other, value) as Other;
			}

			export type _tt = typeof get | typeof head | typeof post | typeof put | typeof delete_ | typeof connect | typeof options | typeof trace | typeof patch | typeof other;
			export type _vt = string | undefined;
			type _common = Omit<VariantImpl, 'tag' | 'value'>;
			export function _ctor(t: _tt, v: _vt): Method {
				return new VariantImpl(t, v) as Method;
			}
			class VariantImpl {
				private readonly _tag: _tt;
				private readonly _value?: _vt;
				constructor(t: _tt, value: _vt) {
					this._tag = t;
					this._value = value;
				}
				get tag(): _tt {
					return this._tag;
				}
				get value(): _vt {
					return this._value;
				}
				isGet(): this is Get {
					return this._tag === Method.get;
				}
				isHead(): this is Head {
					return this._tag === Method.head;
				}
				isPost(): this is Post {
					return this._tag === Method.post;
				}
				isPut(): this is Put {
					return this._tag === Method.put;
				}
				isDelete(): this is Delete {
					return this._tag === Method.delete_;
				}
				isConnect(): this is Connect {
					return this._tag === Method.connect;
				}
				isOptions(): this is Options {
					return this._tag === Method.options;
				}
				isTrace(): this is Trace {
					return this._tag === Method.trace;
				}
				isPatch(): this is Patch {
					return this._tag === Method.patch;
				}
				isOther(): this is Other {
					return this._tag === Method.other;
				}
			}
		}
		export type Method = Method.Get | Method.Head | Method.Post | Method.Put | Method.Delete | Method.Connect | Method.Options | Method.Trace | Method.Patch | Method.Other;


		/**
		 * This type corresponds to HTTP standard Related Schemes.
		 */
		export namespace Scheme {
			export const http = 'HTTP' as const;
			export type HTTP = { readonly tag: typeof http } & _common;
			export function HTTP(): HTTP {
				return new VariantImpl(http, undefined) as HTTP;
			}

			export const https = 'HTTPS' as const;
			export type HTTPS = { readonly tag: typeof https } & _common;
			export function HTTPS(): HTTPS {
				return new VariantImpl(https, undefined) as HTTPS;
			}

			export const other = 'other' as const;
			export type Other = { readonly tag: typeof other; readonly value: string } & _common;
			export function Other(value: string): Other {
				return new VariantImpl(other, value) as Other;
			}

			export type _tt = typeof http | typeof https | typeof other;
			export type _vt = string | undefined;
			type _common = Omit<VariantImpl, 'tag' | 'value'>;
			export function _ctor(t: _tt, v: _vt): Scheme {
				return new VariantImpl(t, v) as Scheme;
			}
			class VariantImpl {
				private readonly _tag: _tt;
				private readonly _value?: _vt;
				constructor(t: _tt, value: _vt) {
					this._tag = t;
					this._value = value;
				}
				get tag(): _tt {
					return this._tag;
				}
				get value(): _vt {
					return this._value;
				}
				isHTTP(): this is HTTP {
					return this._tag === Scheme.http;
				}
				isHTTPS(): this is HTTPS {
					return this._tag === Scheme.https;
				}
				isOther(): this is Other {
					return this._tag === Scheme.other;
				}
			}
		}
		export type Scheme = Scheme.HTTP | Scheme.HTTPS | Scheme.Other;

		/**
		 * Defines the case payload type for `DNS-error` above:
		 */
		export type DNSErrorPayload = {
			rcode?: string | undefined;
			infoCode?: u16 | undefined;
		};

		/**
		 * Defines the case payload type for `TLS-alert-received` above:
		 */
		export type TLSAlertReceivedPayload = {
			alertId?: u8 | undefined;
			alertMessage?: string | undefined;
		};

		/**
		 * Defines the case payload type for `HTTP-response-{header,trailer}-size` above:
		 */
		export type FieldSizePayload = {
			fieldName?: string | undefined;
			fieldSize?: u32 | undefined;
		};


		/**
		 * These cases are inspired by the IANA HTTP Proxy Error Types:
		 * https://www.iana.org/assignments/http-proxy-status/http-proxy-status.xhtml#table-http-proxy-error-types
		 */
		export namespace ErrorCode {
			export const dNSTimeout = 'DNSTimeout' as const;
			export type DNSTimeout = { readonly tag: typeof dNSTimeout } & _common;
			export function DNSTimeout(): DNSTimeout {
				return new VariantImpl(dNSTimeout, undefined) as DNSTimeout;
			}

			export const dNSError = 'DNSError' as const;
			export type DNSError = { readonly tag: typeof dNSError; readonly value: DNSErrorPayload } & _common;
			export function DNSError(value: DNSErrorPayload): DNSError {
				return new VariantImpl(dNSError, value) as DNSError;
			}

			export const destinationNotFound = 'destinationNotFound' as const;
			export type DestinationNotFound = { readonly tag: typeof destinationNotFound } & _common;
			export function DestinationNotFound(): DestinationNotFound {
				return new VariantImpl(destinationNotFound, undefined) as DestinationNotFound;
			}

			export const destinationUnavailable = 'destinationUnavailable' as const;
			export type DestinationUnavailable = { readonly tag: typeof destinationUnavailable } & _common;
			export function DestinationUnavailable(): DestinationUnavailable {
				return new VariantImpl(destinationUnavailable, undefined) as DestinationUnavailable;
			}

			export const destinationIPProhibited = 'destinationIPProhibited' as const;
			export type DestinationIPProhibited = { readonly tag: typeof destinationIPProhibited } & _common;
			export function DestinationIPProhibited(): DestinationIPProhibited {
				return new VariantImpl(destinationIPProhibited, undefined) as DestinationIPProhibited;
			}

			export const destinationIPUnroutable = 'destinationIPUnroutable' as const;
			export type DestinationIPUnroutable = { readonly tag: typeof destinationIPUnroutable } & _common;
			export function DestinationIPUnroutable(): DestinationIPUnroutable {
				return new VariantImpl(destinationIPUnroutable, undefined) as DestinationIPUnroutable;
			}

			export const connectionRefused = 'connectionRefused' as const;
			export type ConnectionRefused = { readonly tag: typeof connectionRefused } & _common;
			export function ConnectionRefused(): ConnectionRefused {
				return new VariantImpl(connectionRefused, undefined) as ConnectionRefused;
			}

			export const connectionTerminated = 'connectionTerminated' as const;
			export type ConnectionTerminated = { readonly tag: typeof connectionTerminated } & _common;
			export function ConnectionTerminated(): ConnectionTerminated {
				return new VariantImpl(connectionTerminated, undefined) as ConnectionTerminated;
			}

			export const connectionTimeout = 'connectionTimeout' as const;
			export type ConnectionTimeout = { readonly tag: typeof connectionTimeout } & _common;
			export function ConnectionTimeout(): ConnectionTimeout {
				return new VariantImpl(connectionTimeout, undefined) as ConnectionTimeout;
			}

			export const connectionReadTimeout = 'connectionReadTimeout' as const;
			export type ConnectionReadTimeout = { readonly tag: typeof connectionReadTimeout } & _common;
			export function ConnectionReadTimeout(): ConnectionReadTimeout {
				return new VariantImpl(connectionReadTimeout, undefined) as ConnectionReadTimeout;
			}

			export const connectionWriteTimeout = 'connectionWriteTimeout' as const;
			export type ConnectionWriteTimeout = { readonly tag: typeof connectionWriteTimeout } & _common;
			export function ConnectionWriteTimeout(): ConnectionWriteTimeout {
				return new VariantImpl(connectionWriteTimeout, undefined) as ConnectionWriteTimeout;
			}

			export const connectionLimitReached = 'connectionLimitReached' as const;
			export type ConnectionLimitReached = { readonly tag: typeof connectionLimitReached } & _common;
			export function ConnectionLimitReached(): ConnectionLimitReached {
				return new VariantImpl(connectionLimitReached, undefined) as ConnectionLimitReached;
			}

			export const tLSProtocolError = 'TLSProtocolError' as const;
			export type TLSProtocolError = { readonly tag: typeof tLSProtocolError } & _common;
			export function TLSProtocolError(): TLSProtocolError {
				return new VariantImpl(tLSProtocolError, undefined) as TLSProtocolError;
			}

			export const tLSCertificateError = 'TLSCertificateError' as const;
			export type TLSCertificateError = { readonly tag: typeof tLSCertificateError } & _common;
			export function TLSCertificateError(): TLSCertificateError {
				return new VariantImpl(tLSCertificateError, undefined) as TLSCertificateError;
			}

			export const tLSAlertReceived = 'TLSAlertReceived' as const;
			export type TLSAlertReceived = { readonly tag: typeof tLSAlertReceived; readonly value: TLSAlertReceivedPayload } & _common;
			export function TLSAlertReceived(value: TLSAlertReceivedPayload): TLSAlertReceived {
				return new VariantImpl(tLSAlertReceived, value) as TLSAlertReceived;
			}

			export const hTTPRequestDenied = 'HTTPRequestDenied' as const;
			export type HTTPRequestDenied = { readonly tag: typeof hTTPRequestDenied } & _common;
			export function HTTPRequestDenied(): HTTPRequestDenied {
				return new VariantImpl(hTTPRequestDenied, undefined) as HTTPRequestDenied;
			}

			export const hTTPRequestLengthRequired = 'HTTPRequestLengthRequired' as const;
			export type HTTPRequestLengthRequired = { readonly tag: typeof hTTPRequestLengthRequired } & _common;
			export function HTTPRequestLengthRequired(): HTTPRequestLengthRequired {
				return new VariantImpl(hTTPRequestLengthRequired, undefined) as HTTPRequestLengthRequired;
			}

			export const hTTPRequestBodySize = 'HTTPRequestBodySize' as const;
			export type HTTPRequestBodySize = { readonly tag: typeof hTTPRequestBodySize; readonly value: u64 | undefined } & _common;
			export function HTTPRequestBodySize(value: u64 | undefined): HTTPRequestBodySize {
				return new VariantImpl(hTTPRequestBodySize, value) as HTTPRequestBodySize;
			}

			export const hTTPRequestMethodInvalid = 'HTTPRequestMethodInvalid' as const;
			export type HTTPRequestMethodInvalid = { readonly tag: typeof hTTPRequestMethodInvalid } & _common;
			export function HTTPRequestMethodInvalid(): HTTPRequestMethodInvalid {
				return new VariantImpl(hTTPRequestMethodInvalid, undefined) as HTTPRequestMethodInvalid;
			}

			export const hTTPRequestURIInvalid = 'HTTPRequestURIInvalid' as const;
			export type HTTPRequestURIInvalid = { readonly tag: typeof hTTPRequestURIInvalid } & _common;
			export function HTTPRequestURIInvalid(): HTTPRequestURIInvalid {
				return new VariantImpl(hTTPRequestURIInvalid, undefined) as HTTPRequestURIInvalid;
			}

			export const hTTPRequestURITooLong = 'HTTPRequestURITooLong' as const;
			export type HTTPRequestURITooLong = { readonly tag: typeof hTTPRequestURITooLong } & _common;
			export function HTTPRequestURITooLong(): HTTPRequestURITooLong {
				return new VariantImpl(hTTPRequestURITooLong, undefined) as HTTPRequestURITooLong;
			}

			export const hTTPRequestHeaderSectionSize = 'HTTPRequestHeaderSectionSize' as const;
			export type HTTPRequestHeaderSectionSize = { readonly tag: typeof hTTPRequestHeaderSectionSize; readonly value: u32 | undefined } & _common;
			export function HTTPRequestHeaderSectionSize(value: u32 | undefined): HTTPRequestHeaderSectionSize {
				return new VariantImpl(hTTPRequestHeaderSectionSize, value) as HTTPRequestHeaderSectionSize;
			}

			export const hTTPRequestHeaderSize = 'HTTPRequestHeaderSize' as const;
			export type HTTPRequestHeaderSize = { readonly tag: typeof hTTPRequestHeaderSize; readonly value: FieldSizePayload | undefined } & _common;
			export function HTTPRequestHeaderSize(value: FieldSizePayload | undefined): HTTPRequestHeaderSize {
				return new VariantImpl(hTTPRequestHeaderSize, value) as HTTPRequestHeaderSize;
			}

			export const hTTPRequestTrailerSectionSize = 'HTTPRequestTrailerSectionSize' as const;
			export type HTTPRequestTrailerSectionSize = { readonly tag: typeof hTTPRequestTrailerSectionSize; readonly value: u32 | undefined } & _common;
			export function HTTPRequestTrailerSectionSize(value: u32 | undefined): HTTPRequestTrailerSectionSize {
				return new VariantImpl(hTTPRequestTrailerSectionSize, value) as HTTPRequestTrailerSectionSize;
			}

			export const hTTPRequestTrailerSize = 'HTTPRequestTrailerSize' as const;
			export type HTTPRequestTrailerSize = { readonly tag: typeof hTTPRequestTrailerSize; readonly value: FieldSizePayload } & _common;
			export function HTTPRequestTrailerSize(value: FieldSizePayload): HTTPRequestTrailerSize {
				return new VariantImpl(hTTPRequestTrailerSize, value) as HTTPRequestTrailerSize;
			}

			export const hTTPResponseIncomplete = 'HTTPResponseIncomplete' as const;
			export type HTTPResponseIncomplete = { readonly tag: typeof hTTPResponseIncomplete } & _common;
			export function HTTPResponseIncomplete(): HTTPResponseIncomplete {
				return new VariantImpl(hTTPResponseIncomplete, undefined) as HTTPResponseIncomplete;
			}

			export const hTTPResponseHeaderSectionSize = 'HTTPResponseHeaderSectionSize' as const;
			export type HTTPResponseHeaderSectionSize = { readonly tag: typeof hTTPResponseHeaderSectionSize; readonly value: u32 | undefined } & _common;
			export function HTTPResponseHeaderSectionSize(value: u32 | undefined): HTTPResponseHeaderSectionSize {
				return new VariantImpl(hTTPResponseHeaderSectionSize, value) as HTTPResponseHeaderSectionSize;
			}

			export const hTTPResponseHeaderSize = 'HTTPResponseHeaderSize' as const;
			export type HTTPResponseHeaderSize = { readonly tag: typeof hTTPResponseHeaderSize; readonly value: FieldSizePayload } & _common;
			export function HTTPResponseHeaderSize(value: FieldSizePayload): HTTPResponseHeaderSize {
				return new VariantImpl(hTTPResponseHeaderSize, value) as HTTPResponseHeaderSize;
			}

			export const hTTPResponseBodySize = 'HTTPResponseBodySize' as const;
			export type HTTPResponseBodySize = { readonly tag: typeof hTTPResponseBodySize; readonly value: u64 | undefined } & _common;
			export function HTTPResponseBodySize(value: u64 | undefined): HTTPResponseBodySize {
				return new VariantImpl(hTTPResponseBodySize, value) as HTTPResponseBodySize;
			}

			export const hTTPResponseTrailerSectionSize = 'HTTPResponseTrailerSectionSize' as const;
			export type HTTPResponseTrailerSectionSize = { readonly tag: typeof hTTPResponseTrailerSectionSize; readonly value: u32 | undefined } & _common;
			export function HTTPResponseTrailerSectionSize(value: u32 | undefined): HTTPResponseTrailerSectionSize {
				return new VariantImpl(hTTPResponseTrailerSectionSize, value) as HTTPResponseTrailerSectionSize;
			}

			export const hTTPResponseTrailerSize = 'HTTPResponseTrailerSize' as const;
			export type HTTPResponseTrailerSize = { readonly tag: typeof hTTPResponseTrailerSize; readonly value: FieldSizePayload } & _common;
			export function HTTPResponseTrailerSize(value: FieldSizePayload): HTTPResponseTrailerSize {
				return new VariantImpl(hTTPResponseTrailerSize, value) as HTTPResponseTrailerSize;
			}

			export const hTTPResponseTransferCoding = 'HTTPResponseTransferCoding' as const;
			export type HTTPResponseTransferCoding = { readonly tag: typeof hTTPResponseTransferCoding; readonly value: string | undefined } & _common;
			export function HTTPResponseTransferCoding(value: string | undefined): HTTPResponseTransferCoding {
				return new VariantImpl(hTTPResponseTransferCoding, value) as HTTPResponseTransferCoding;
			}

			export const hTTPResponseContentCoding = 'HTTPResponseContentCoding' as const;
			export type HTTPResponseContentCoding = { readonly tag: typeof hTTPResponseContentCoding; readonly value: string | undefined } & _common;
			export function HTTPResponseContentCoding(value: string | undefined): HTTPResponseContentCoding {
				return new VariantImpl(hTTPResponseContentCoding, value) as HTTPResponseContentCoding;
			}

			export const hTTPResponseTimeout = 'HTTPResponseTimeout' as const;
			export type HTTPResponseTimeout = { readonly tag: typeof hTTPResponseTimeout } & _common;
			export function HTTPResponseTimeout(): HTTPResponseTimeout {
				return new VariantImpl(hTTPResponseTimeout, undefined) as HTTPResponseTimeout;
			}

			export const hTTPUpgradeFailed = 'HTTPUpgradeFailed' as const;
			export type HTTPUpgradeFailed = { readonly tag: typeof hTTPUpgradeFailed } & _common;
			export function HTTPUpgradeFailed(): HTTPUpgradeFailed {
				return new VariantImpl(hTTPUpgradeFailed, undefined) as HTTPUpgradeFailed;
			}

			export const hTTPProtocolError = 'HTTPProtocolError' as const;
			export type HTTPProtocolError = { readonly tag: typeof hTTPProtocolError } & _common;
			export function HTTPProtocolError(): HTTPProtocolError {
				return new VariantImpl(hTTPProtocolError, undefined) as HTTPProtocolError;
			}

			export const loopDetected = 'loopDetected' as const;
			export type LoopDetected = { readonly tag: typeof loopDetected } & _common;
			export function LoopDetected(): LoopDetected {
				return new VariantImpl(loopDetected, undefined) as LoopDetected;
			}

			export const configurationError = 'configurationError' as const;
			export type ConfigurationError = { readonly tag: typeof configurationError } & _common;
			export function ConfigurationError(): ConfigurationError {
				return new VariantImpl(configurationError, undefined) as ConfigurationError;
			}


			/**
			 * This is a catch-all error for anything that doesn't fit cleanly into a
			 * more specific case. It also includes an optional string for an
			 * unstructured description of the error. Users should not depend on the
			 * string for diagnosing errors, as it's not required to be consistent
			 * between implementations.
			 */
			export const internalError = 'internalError' as const;
			export type InternalError = { readonly tag: typeof internalError; readonly value: string | undefined } & _common;
			export function InternalError(value: string | undefined): InternalError {
				return new VariantImpl(internalError, value) as InternalError;
			}

			export type _tt = typeof dNSTimeout | typeof dNSError | typeof destinationNotFound | typeof destinationUnavailable | typeof destinationIPProhibited | typeof destinationIPUnroutable | typeof connectionRefused | typeof connectionTerminated | typeof connectionTimeout | typeof connectionReadTimeout | typeof connectionWriteTimeout | typeof connectionLimitReached | typeof tLSProtocolError | typeof tLSCertificateError | typeof tLSAlertReceived | typeof hTTPRequestDenied | typeof hTTPRequestLengthRequired | typeof hTTPRequestBodySize | typeof hTTPRequestMethodInvalid | typeof hTTPRequestURIInvalid | typeof hTTPRequestURITooLong | typeof hTTPRequestHeaderSectionSize | typeof hTTPRequestHeaderSize | typeof hTTPRequestTrailerSectionSize | typeof hTTPRequestTrailerSize | typeof hTTPResponseIncomplete | typeof hTTPResponseHeaderSectionSize | typeof hTTPResponseHeaderSize | typeof hTTPResponseBodySize | typeof hTTPResponseTrailerSectionSize | typeof hTTPResponseTrailerSize | typeof hTTPResponseTransferCoding | typeof hTTPResponseContentCoding | typeof hTTPResponseTimeout | typeof hTTPUpgradeFailed | typeof hTTPProtocolError | typeof loopDetected | typeof configurationError | typeof internalError;
			export type _vt = DNSErrorPayload | TLSAlertReceivedPayload | u64 | undefined | u32 | undefined | FieldSizePayload | undefined | u32 | undefined | FieldSizePayload | u32 | undefined | FieldSizePayload | u64 | undefined | u32 | undefined | FieldSizePayload | string | undefined | string | undefined | string | undefined | undefined;
			type _common = Omit<VariantImpl, 'tag' | 'value'>;
			export function _ctor(t: _tt, v: _vt): ErrorCode {
				return new VariantImpl(t, v) as ErrorCode;
			}
			class VariantImpl {
				private readonly _tag: _tt;
				private readonly _value?: _vt;
				constructor(t: _tt, value: _vt) {
					this._tag = t;
					this._value = value;
				}
				get tag(): _tt {
					return this._tag;
				}
				get value(): _vt {
					return this._value;
				}
				isDNSTimeout(): this is DNSTimeout {
					return this._tag === ErrorCode.dNSTimeout;
				}
				isDNSError(): this is DNSError {
					return this._tag === ErrorCode.dNSError;
				}
				isDestinationNotFound(): this is DestinationNotFound {
					return this._tag === ErrorCode.destinationNotFound;
				}
				isDestinationUnavailable(): this is DestinationUnavailable {
					return this._tag === ErrorCode.destinationUnavailable;
				}
				isDestinationIPProhibited(): this is DestinationIPProhibited {
					return this._tag === ErrorCode.destinationIPProhibited;
				}
				isDestinationIPUnroutable(): this is DestinationIPUnroutable {
					return this._tag === ErrorCode.destinationIPUnroutable;
				}
				isConnectionRefused(): this is ConnectionRefused {
					return this._tag === ErrorCode.connectionRefused;
				}
				isConnectionTerminated(): this is ConnectionTerminated {
					return this._tag === ErrorCode.connectionTerminated;
				}
				isConnectionTimeout(): this is ConnectionTimeout {
					return this._tag === ErrorCode.connectionTimeout;
				}
				isConnectionReadTimeout(): this is ConnectionReadTimeout {
					return this._tag === ErrorCode.connectionReadTimeout;
				}
				isConnectionWriteTimeout(): this is ConnectionWriteTimeout {
					return this._tag === ErrorCode.connectionWriteTimeout;
				}
				isConnectionLimitReached(): this is ConnectionLimitReached {
					return this._tag === ErrorCode.connectionLimitReached;
				}
				isTLSProtocolError(): this is TLSProtocolError {
					return this._tag === ErrorCode.tLSProtocolError;
				}
				isTLSCertificateError(): this is TLSCertificateError {
					return this._tag === ErrorCode.tLSCertificateError;
				}
				isTLSAlertReceived(): this is TLSAlertReceived {
					return this._tag === ErrorCode.tLSAlertReceived;
				}
				isHTTPRequestDenied(): this is HTTPRequestDenied {
					return this._tag === ErrorCode.hTTPRequestDenied;
				}
				isHTTPRequestLengthRequired(): this is HTTPRequestLengthRequired {
					return this._tag === ErrorCode.hTTPRequestLengthRequired;
				}
				isHTTPRequestBodySize(): this is HTTPRequestBodySize {
					return this._tag === ErrorCode.hTTPRequestBodySize;
				}
				isHTTPRequestMethodInvalid(): this is HTTPRequestMethodInvalid {
					return this._tag === ErrorCode.hTTPRequestMethodInvalid;
				}
				isHTTPRequestURIInvalid(): this is HTTPRequestURIInvalid {
					return this._tag === ErrorCode.hTTPRequestURIInvalid;
				}
				isHTTPRequestURITooLong(): this is HTTPRequestURITooLong {
					return this._tag === ErrorCode.hTTPRequestURITooLong;
				}
				isHTTPRequestHeaderSectionSize(): this is HTTPRequestHeaderSectionSize {
					return this._tag === ErrorCode.hTTPRequestHeaderSectionSize;
				}
				isHTTPRequestHeaderSize(): this is HTTPRequestHeaderSize {
					return this._tag === ErrorCode.hTTPRequestHeaderSize;
				}
				isHTTPRequestTrailerSectionSize(): this is HTTPRequestTrailerSectionSize {
					return this._tag === ErrorCode.hTTPRequestTrailerSectionSize;
				}
				isHTTPRequestTrailerSize(): this is HTTPRequestTrailerSize {
					return this._tag === ErrorCode.hTTPRequestTrailerSize;
				}
				isHTTPResponseIncomplete(): this is HTTPResponseIncomplete {
					return this._tag === ErrorCode.hTTPResponseIncomplete;
				}
				isHTTPResponseHeaderSectionSize(): this is HTTPResponseHeaderSectionSize {
					return this._tag === ErrorCode.hTTPResponseHeaderSectionSize;
				}
				isHTTPResponseHeaderSize(): this is HTTPResponseHeaderSize {
					return this._tag === ErrorCode.hTTPResponseHeaderSize;
				}
				isHTTPResponseBodySize(): this is HTTPResponseBodySize {
					return this._tag === ErrorCode.hTTPResponseBodySize;
				}
				isHTTPResponseTrailerSectionSize(): this is HTTPResponseTrailerSectionSize {
					return this._tag === ErrorCode.hTTPResponseTrailerSectionSize;
				}
				isHTTPResponseTrailerSize(): this is HTTPResponseTrailerSize {
					return this._tag === ErrorCode.hTTPResponseTrailerSize;
				}
				isHTTPResponseTransferCoding(): this is HTTPResponseTransferCoding {
					return this._tag === ErrorCode.hTTPResponseTransferCoding;
				}
				isHTTPResponseContentCoding(): this is HTTPResponseContentCoding {
					return this._tag === ErrorCode.hTTPResponseContentCoding;
				}
				isHTTPResponseTimeout(): this is HTTPResponseTimeout {
					return this._tag === ErrorCode.hTTPResponseTimeout;
				}
				isHTTPUpgradeFailed(): this is HTTPUpgradeFailed {
					return this._tag === ErrorCode.hTTPUpgradeFailed;
				}
				isHTTPProtocolError(): this is HTTPProtocolError {
					return this._tag === ErrorCode.hTTPProtocolError;
				}
				isLoopDetected(): this is LoopDetected {
					return this._tag === ErrorCode.loopDetected;
				}
				isConfigurationError(): this is ConfigurationError {
					return this._tag === ErrorCode.configurationError;
				}
				isInternalError(): this is InternalError {
					return this._tag === ErrorCode.internalError;
				}
			}
		}
		export type ErrorCode = ErrorCode.DNSTimeout | ErrorCode.DNSError | ErrorCode.DestinationNotFound | ErrorCode.DestinationUnavailable | ErrorCode.DestinationIPProhibited | ErrorCode.DestinationIPUnroutable | ErrorCode.ConnectionRefused | ErrorCode.ConnectionTerminated | ErrorCode.ConnectionTimeout | ErrorCode.ConnectionReadTimeout | ErrorCode.ConnectionWriteTimeout | ErrorCode.ConnectionLimitReached | ErrorCode.TLSProtocolError | ErrorCode.TLSCertificateError | ErrorCode.TLSAlertReceived | ErrorCode.HTTPRequestDenied | ErrorCode.HTTPRequestLengthRequired | ErrorCode.HTTPRequestBodySize | ErrorCode.HTTPRequestMethodInvalid | ErrorCode.HTTPRequestURIInvalid | ErrorCode.HTTPRequestURITooLong | ErrorCode.HTTPRequestHeaderSectionSize | ErrorCode.HTTPRequestHeaderSize | ErrorCode.HTTPRequestTrailerSectionSize | ErrorCode.HTTPRequestTrailerSize | ErrorCode.HTTPResponseIncomplete | ErrorCode.HTTPResponseHeaderSectionSize | ErrorCode.HTTPResponseHeaderSize | ErrorCode.HTTPResponseBodySize | ErrorCode.HTTPResponseTrailerSectionSize | ErrorCode.HTTPResponseTrailerSize | ErrorCode.HTTPResponseTransferCoding | ErrorCode.HTTPResponseContentCoding | ErrorCode.HTTPResponseTimeout | ErrorCode.HTTPUpgradeFailed | ErrorCode.HTTPProtocolError | ErrorCode.LoopDetected | ErrorCode.ConfigurationError | ErrorCode.InternalError;


		/**
		 * This type enumerates the different kinds of errors that may occur when
		 * setting or appending to a `fields` resource.
		 */
		export namespace HeaderError {

			/**
			 * This error indicates that a `field-key` or `field-value` was
			 * syntactically invalid when used with an operation that sets headers in a
			 * `fields`.
			 */
			export const invalidSyntax = 'invalidSyntax' as const;
			export type InvalidSyntax = { readonly tag: typeof invalidSyntax } & _common;
			export function InvalidSyntax(): InvalidSyntax {
				return new VariantImpl(invalidSyntax, undefined) as InvalidSyntax;
			}


			/**
			 * This error indicates that a forbidden `field-key` was used when trying
			 * to set a header in a `fields`.
			 */
			export const forbidden = 'forbidden' as const;
			export type Forbidden = { readonly tag: typeof forbidden } & _common;
			export function Forbidden(): Forbidden {
				return new VariantImpl(forbidden, undefined) as Forbidden;
			}


			/**
			 * This error indicates that the operation on the `fields` was not
			 * permitted because the fields are immutable.
			 */
			export const immutable = 'immutable' as const;
			export type Immutable = { readonly tag: typeof immutable } & _common;
			export function Immutable(): Immutable {
				return new VariantImpl(immutable, undefined) as Immutable;
			}

			export type _tt = typeof invalidSyntax | typeof forbidden | typeof immutable;
			export type _vt = undefined;
			type _common = Omit<VariantImpl, 'tag' | 'value'>;
			export function _ctor(t: _tt, v: _vt): HeaderError {
				return new VariantImpl(t, v) as HeaderError;
			}
			class VariantImpl {
				private readonly _tag: _tt;
				private readonly _value?: _vt;
				constructor(t: _tt, value: _vt) {
					this._tag = t;
					this._value = value;
				}
				get tag(): _tt {
					return this._tag;
				}
				get value(): _vt {
					return this._value;
				}
				isInvalidSyntax(): this is InvalidSyntax {
					return this._tag === HeaderError.invalidSyntax;
				}
				isForbidden(): this is Forbidden {
					return this._tag === HeaderError.forbidden;
				}
				isImmutable(): this is Immutable {
					return this._tag === HeaderError.immutable;
				}
			}
		}
		export type HeaderError = HeaderError.InvalidSyntax | HeaderError.Forbidden | HeaderError.Immutable;

		/**
		 * Field keys are always strings.
		 */
		export type FieldKey = string;

		/**
		 * Field values should always be ASCII strings. However, in
		 * reality, HTTP implementations often have to interpret malformed values,
		 * so they are provided as a list of bytes.
		 */
		export type FieldValue = Uint8Array;

		/**
		 * Headers is an alias for Fields.
		 */
		export type Headers = Fields;

		/**
		 * Trailers is an alias for Fields.
		 */
		export type Trailers = Fields;

		/**
		 * This type corresponds to the HTTP standard Status Code.
		 */
		export type StatusCode = u16;

		export namespace Fields {
			export interface Interface {
				$handle?: $wcm.ResourceHandle;

				/**
				 * Get all of the values corresponding to a key. If the key is not present
				 * in this `fields`, an empty list is returned. However, if the key is
				 * present but empty, this is represented by a list with one or more
				 * empty field-values present.
				 */
				get(name: FieldKey): FieldValue[];

				/**
				 * Returns `true` when the key is present in this `fields`. If the key is
				 * syntactically invalid, `false` is returned.
				 */
				has(name: FieldKey): boolean;

				/**
				 * Set all of the values for a key. Clears any existing values for that
				 * key, if they have been set.
				 * 
				 * Fails with `header-error.immutable` if the `fields` are immutable.
				 */
				set(name: FieldKey, value: FieldValue[]): result<void, HeaderError>;

				/**
				 * Delete all values for a key. Does nothing if no values for the key
				 * exist.
				 * 
				 * Fails with `header-error.immutable` if the `fields` are immutable.
				 */
				delete(name: FieldKey): result<void, HeaderError>;

				/**
				 * Append a value for a key. Does not change or delete any existing
				 * values for that key.
				 * 
				 * Fails with `header-error.immutable` if the `fields` are immutable.
				 */
				append(name: FieldKey, value: FieldValue): result<void, HeaderError>;

				/**
				 * Retrieve the full set of keys and values in the Fields. Like the
				 * constructor, the list represents each key-value pair.
				 * 
				 * The outer list represents each key-value pair in the Fields. Keys
				 * which have multiple values are represented by multiple entries in this
				 * list with the same key.
				 */
				entries(): [FieldKey, FieldValue][];

				/**
				 * Make a deep copy of the Fields. Equivelant in behavior to calling the
				 * `fields` constructor on the return value of `entries`. The resulting
				 * `fields` is mutable.
				 */
				clone(): own<Fields>;
			}
			export type Statics = {
				$new?(): Interface;
				$drop(inst: Interface): void;
				fromList(entries: [FieldKey, FieldValue][]): result<own<Fields>, HeaderError>;
			};
			export type Class = Statics & {
				new(): Interface;
			};
		}
		export type Fields = Fields.Interface;

		export namespace IncomingRequest {
			export interface Interface {
				$handle?: $wcm.ResourceHandle;

				/**
				 * Returns the method of the incoming request.
				 */
				method(): Method;

				/**
				 * Returns the path with query parameters from the request, as a string.
				 */
				pathWithQuery(): string | undefined;

				/**
				 * Returns the protocol scheme from the request.
				 */
				scheme(): Scheme | undefined;

				/**
				 * Returns the authority from the request, if it was present.
				 */
				authority(): string | undefined;

				/**
				 * Get the `headers` associated with the request.
				 * 
				 * The returned `headers` resource is immutable: `set`, `append`, and
				 * `delete` operations will fail with `header-error.immutable`.
				 * 
				 * The `headers` returned are a child resource: it must be dropped before
				 * the parent `incoming-request` is dropped. Dropping this
				 * `incoming-request` before all children are dropped will trap.
				 */
				headers(): own<Headers>;

				/**
				 * Gives the `incoming-body` associated with this request. Will only
				 * return success at most once, and subsequent calls will return error.
				 */
				consume(): result<own<IncomingBody>, void>;
			}
			export type Statics = {
				$drop(inst: Interface): void;
			};
			export type Class = Statics & {
			};
		}
		export type IncomingRequest = IncomingRequest.Interface;

		export namespace OutgoingRequest {
			export interface Interface {
				$handle?: $wcm.ResourceHandle;

				/**
				 * Returns the resource corresponding to the outgoing Body for this
				 * Request.
				 * 
				 * Returns success on the first call: the `outgoing-body` resource for
				 * this `outgoing-request` can be retrieved at most once. Subsequent
				 * calls will return error.
				 */
				body(): result<own<OutgoingBody>, void>;

				/**
				 * Get the Method for the Request.
				 */
				method(): Method;

				/**
				 * Set the Method for the Request. Fails if the string present in a
				 * `method.other` argument is not a syntactically valid method.
				 */
				setMethod(method: Method): result<void, void>;

				/**
				 * Get the combination of the HTTP Path and Query for the Request.
				 * When `none`, this represents an empty Path and empty Query.
				 */
				pathWithQuery(): string | undefined;

				/**
				 * Set the combination of the HTTP Path and Query for the Request.
				 * When `none`, this represents an empty Path and empty Query. Fails is the
				 * string given is not a syntactically valid path and query uri component.
				 */
				setPathWithQuery(pathWithQuery: string | undefined): result<void, void>;

				/**
				 * Get the HTTP Related Scheme for the Request. When `none`, the
				 * implementation may choose an appropriate default scheme.
				 */
				scheme(): Scheme | undefined;

				/**
				 * Set the HTTP Related Scheme for the Request. When `none`, the
				 * implementation may choose an appropriate default scheme. Fails if the
				 * string given is not a syntactically valid uri scheme.
				 */
				setScheme(scheme: Scheme | undefined): result<void, void>;

				/**
				 * Get the HTTP Authority for the Request. A value of `none` may be used
				 * with Related Schemes which do not require an Authority. The HTTP and
				 * HTTPS schemes always require an authority.
				 */
				authority(): string | undefined;

				/**
				 * Set the HTTP Authority for the Request. A value of `none` may be used
				 * with Related Schemes which do not require an Authority. The HTTP and
				 * HTTPS schemes always require an authority. Fails if the string given is
				 * not a syntactically valid uri authority.
				 */
				setAuthority(authority: string | undefined): result<void, void>;

				/**
				 * Get the headers associated with the Request.
				 * 
				 * The returned `headers` resource is immutable: `set`, `append`, and
				 * `delete` operations will fail with `header-error.immutable`.
				 * 
				 * This headers resource is a child: it must be dropped before the parent
				 * `outgoing-request` is dropped, or its ownership is transfered to
				 * another component by e.g. `outgoing-handler.handle`.
				 */
				headers(): own<Headers>;
			}
			export type Statics = {
				$new?(headers: own<Headers>): Interface;
				$drop(inst: Interface): void;
			};
			export type Class = Statics & {
				new(headers: own<Headers>): Interface;
			};
		}
		export type OutgoingRequest = OutgoingRequest.Interface;

		export namespace RequestOptions {
			export interface Interface {
				$handle?: $wcm.ResourceHandle;

				/**
				 * The timeout for the initial connect to the HTTP Server.
				 */
				connectTimeout(): Duration | undefined;

				/**
				 * Set the timeout for the initial connect to the HTTP Server. An error
				 * return value indicates that this timeout is not supported.
				 */
				setConnectTimeout(duration: Duration | undefined): result<void, void>;

				/**
				 * The timeout for receiving the first byte of the Response body.
				 */
				firstByteTimeout(): Duration | undefined;

				/**
				 * Set the timeout for receiving the first byte of the Response body. An
				 * error return value indicates that this timeout is not supported.
				 */
				setFirstByteTimeout(duration: Duration | undefined): result<void, void>;

				/**
				 * The timeout for receiving subsequent chunks of bytes in the Response
				 * body stream.
				 */
				betweenBytesTimeout(): Duration | undefined;

				/**
				 * Set the timeout for receiving subsequent chunks of bytes in the Response
				 * body stream. An error return value indicates that this timeout is not
				 * supported.
				 */
				setBetweenBytesTimeout(duration: Duration | undefined): result<void, void>;
			}
			export type Statics = {
				$new?(): Interface;
				$drop(inst: Interface): void;
			};
			export type Class = Statics & {
				new(): Interface;
			};
		}
		export type RequestOptions = RequestOptions.Interface;

		export namespace ResponseOutparam {
			export interface Interface {
				$handle?: $wcm.ResourceHandle;

			}
			export type Statics = {
				$drop(inst: Interface): void;
				set(param: own<ResponseOutparam>, response: result<own<OutgoingResponse>, ErrorCode>): void;
			};
			export type Class = Statics & {
			};
		}
		export type ResponseOutparam = ResponseOutparam.Interface;

		export namespace IncomingResponse {
			export interface Interface {
				$handle?: $wcm.ResourceHandle;

				/**
				 * Returns the status code from the incoming response.
				 */
				status(): StatusCode;

				/**
				 * Returns the headers from the incoming response.
				 * 
				 * The returned `headers` resource is immutable: `set`, `append`, and
				 * `delete` operations will fail with `header-error.immutable`.
				 * 
				 * This headers resource is a child: it must be dropped before the parent
				 * `incoming-response` is dropped.
				 */
				headers(): own<Headers>;

				/**
				 * Returns the incoming body. May be called at most once. Returns error
				 * if called additional times.
				 */
				consume(): result<own<IncomingBody>, void>;
			}
			export type Statics = {
				$drop(inst: Interface): void;
			};
			export type Class = Statics & {
			};
		}
		export type IncomingResponse = IncomingResponse.Interface;

		export namespace IncomingBody {
			export interface Interface {
				$handle?: $wcm.ResourceHandle;

				/**
				 * Returns the contents of the body, as a stream of bytes.
				 * 
				 * Returns success on first call: the stream representing the contents
				 * can be retrieved at most once. Subsequent calls will return error.
				 * 
				 * The returned `input-stream` resource is a child: it must be dropped
				 * before the parent `incoming-body` is dropped, or consumed by
				 * `incoming-body.finish`.
				 * 
				 * This invariant ensures that the implementation can determine whether
				 * the user is consuming the contents of the body, waiting on the
				 * `future-trailers` to be ready, or neither. This allows for network
				 * backpressure is to be applied when the user is consuming the body,
				 * and for that backpressure to not inhibit delivery of the trailers if
				 * the user does not read the entire body.
				 */
				stream(): result<own<InputStream>, void>;
			}
			export type Statics = {
				$drop(inst: Interface): void;
				finish(this_: own<IncomingBody>): own<FutureTrailers>;
			};
			export type Class = Statics & {
			};
		}
		export type IncomingBody = IncomingBody.Interface;

		export namespace FutureTrailers {
			export interface Interface {
				$handle?: $wcm.ResourceHandle;

				/**
				 * Returns a pollable which becomes ready when either the trailers have
				 * been received, or an error has occured. When this pollable is ready,
				 * the `get` method will return `some`.
				 */
				subscribe(): own<Pollable>;

				/**
				 * Returns the contents of the trailers, or an error which occured,
				 * once the future is ready.
				 * 
				 * The outer `option` represents future readiness. Users can wait on this
				 * `option` to become `some` using the `subscribe` method.
				 * 
				 * The outer `result` is used to retrieve the trailers or error at most
				 * once. It will be success on the first call in which the outer option
				 * is `some`, and error on subsequent calls.
				 * 
				 * The inner `result` represents that either the HTTP Request or Response
				 * body, as well as any trailers, were received successfully, or that an
				 * error occured receiving them. The optional `trailers` indicates whether
				 * or not trailers were present in the body.
				 * 
				 * When some `trailers` are returned by this method, the `trailers`
				 * resource is immutable, and a child. Use of the `set`, `append`, or
				 * `delete` methods will return an error, and the resource must be
				 * dropped before the parent `future-trailers` is dropped.
				 */
				get(): result<result<own<Trailers> | undefined, ErrorCode>, void> | undefined;
			}
			export type Statics = {
				$drop(inst: Interface): void;
			};
			export type Class = Statics & {
			};
		}
		export type FutureTrailers = FutureTrailers.Interface;

		export namespace OutgoingResponse {
			export interface Interface {
				$handle?: $wcm.ResourceHandle;

				/**
				 * Get the HTTP Status Code for the Response.
				 */
				statusCode(): StatusCode;

				/**
				 * Set the HTTP Status Code for the Response. Fails if the status-code
				 * given is not a valid http status code.
				 */
				setStatusCode(statusCode: StatusCode): result<void, void>;

				/**
				 * Get the headers associated with the Request.
				 * 
				 * The returned `headers` resource is immutable: `set`, `append`, and
				 * `delete` operations will fail with `header-error.immutable`.
				 * 
				 * This headers resource is a child: it must be dropped before the parent
				 * `outgoing-request` is dropped, or its ownership is transfered to
				 * another component by e.g. `outgoing-handler.handle`.
				 */
				headers(): own<Headers>;

				/**
				 * Returns the resource corresponding to the outgoing Body for this Response.
				 * 
				 * Returns success on the first call: the `outgoing-body` resource for
				 * this `outgoing-response` can be retrieved at most once. Subsequent
				 * calls will return error.
				 */
				body(): result<own<OutgoingBody>, void>;
			}
			export type Statics = {
				$new?(headers: own<Headers>): Interface;
				$drop(inst: Interface): void;
			};
			export type Class = Statics & {
				new(headers: own<Headers>): Interface;
			};
		}
		export type OutgoingResponse = OutgoingResponse.Interface;

		export namespace OutgoingBody {
			export interface Interface {
				$handle?: $wcm.ResourceHandle;

				/**
				 * Returns a stream for writing the body contents.
				 * 
				 * The returned `output-stream` is a child resource: it must be dropped
				 * before the parent `outgoing-body` resource is dropped (or finished),
				 * otherwise the `outgoing-body` drop or `finish` will trap.
				 * 
				 * Returns success on the first call: the `output-stream` resource for
				 * this `outgoing-body` may be retrieved at most once. Subsequent calls
				 * will return error.
				 */
				write(): result<own<OutputStream>, void>;
			}
			export type Statics = {
				$drop(inst: Interface): void;
				finish(this_: own<OutgoingBody>, trailers: own<Trailers> | undefined): result<void, ErrorCode>;
			};
			export type Class = Statics & {
			};
		}
		export type OutgoingBody = OutgoingBody.Interface;

		export namespace FutureIncomingResponse {
			export interface Interface {
				$handle?: $wcm.ResourceHandle;

				/**
				 * Returns a pollable which becomes ready when either the Response has
				 * been received, or an error has occured. When this pollable is ready,
				 * the `get` method will return `some`.
				 */
				subscribe(): own<Pollable>;

				/**
				 * Returns the incoming HTTP Response, or an error, once one is ready.
				 * 
				 * The outer `option` represents future readiness. Users can wait on this
				 * `option` to become `some` using the `subscribe` method.
				 * 
				 * The outer `result` is used to retrieve the response or error at most
				 * once. It will be success on the first call in which the outer option
				 * is `some`, and error on subsequent calls.
				 * 
				 * The inner `result` represents that either the incoming HTTP Response
				 * status and headers have recieved successfully, or that an error
				 * occured. Errors may also occur while consuming the response body,
				 * but those will be reported by the `incoming-body` and its
				 * `output-stream` child.
				 */
				get(): result<result<own<IncomingResponse>, ErrorCode>, void> | undefined;
			}
			export type Statics = {
				$drop(inst: Interface): void;
			};
			export type Class = Statics & {
			};
		}
		export type FutureIncomingResponse = FutureIncomingResponse.Interface;

		/**
		 * Attempts to extract a http-related `error` from the wasi:io `error`
		 * provided.
		 * 
		 * Stream operations which return
		 * `wasi:io/stream/stream-error::last-operation-failed` have a payload of
		 * type `wasi:io/error/error` with more information about the operation
		 * that failed. This payload can be passed through to this function to see
		 * if there's http-related information about the error to return.
		 * 
		 * Note that this function is fallible because not all io-errors are
		 * http-related errors.
		 */
		export type httpErrorCode = (err: borrow<IoError>) => ErrorCode | undefined;
	}
	export type Types = {
		Fields: Types.Fields.Class;
		IncomingRequest: Types.IncomingRequest.Class;
		OutgoingRequest: Types.OutgoingRequest.Class;
		RequestOptions: Types.RequestOptions.Class;
		ResponseOutparam: Types.ResponseOutparam.Class;
		IncomingResponse: Types.IncomingResponse.Class;
		IncomingBody: Types.IncomingBody.Class;
		FutureTrailers: Types.FutureTrailers.Class;
		OutgoingResponse: Types.OutgoingResponse.Class;
		OutgoingBody: Types.OutgoingBody.Class;
		FutureIncomingResponse: Types.FutureIncomingResponse.Class;
		httpErrorCode: Types.httpErrorCode;
	};

	/**
	 * This interface defines a handler of incoming HTTP Requests. It should
	 * be exported by components which can respond to HTTP Requests.
	 */
	export namespace IncomingHandler {

		export type IncomingRequest = http.Types.IncomingRequest;

		export type ResponseOutparam = http.Types.ResponseOutparam;

		/**
		 * This function is invoked with an incoming HTTP Request, and a resource
		 * `response-outparam` which provides the capability to reply with an HTTP
		 * Response. The response is sent by calling the `response-outparam.set`
		 * method, which allows execution to continue after the response has been
		 * sent. This enables both streaming to the response body, and performing other
		 * work.
		 * 
		 * The implementor of this function must write a response to the
		 * `response-outparam` before returning, or else the caller will respond
		 * with an error on its behalf.
		 */
		export type handle = (request: own<IncomingRequest>, responseOut: own<ResponseOutparam>) => void;
	}
	export type IncomingHandler = {
		handle: IncomingHandler.handle;
	};

	/**
	 * This interface defines a handler of outgoing HTTP Requests. It should be
	 * imported by components which wish to make HTTP Requests.
	 */
	export namespace OutgoingHandler {

		export type OutgoingRequest = http.Types.OutgoingRequest;

		export type RequestOptions = http.Types.RequestOptions;

		export type FutureIncomingResponse = http.Types.FutureIncomingResponse;

		export type ErrorCode = http.Types.ErrorCode;

		/**
		 * This function is invoked with an outgoing HTTP Request, and it returns
		 * a resource `future-incoming-response` which represents an HTTP Response
		 * which may arrive in the future.
		 * 
		 * The `options` argument accepts optional parameters for the HTTP
		 * protocol's transport layer.
		 * 
		 * This function may return an error if the `outgoing-request` is invalid
		 * or not allowed to be made. Otherwise, protocol errors are reported
		 * through the `future-incoming-response`.
		 */
		export type handle = (request: own<OutgoingRequest>, options: own<RequestOptions> | undefined) => result<own<FutureIncomingResponse>, ErrorCode>;
	}
	export type OutgoingHandler = {
		handle: OutgoingHandler.handle;
	};

}
export type http = {
	Types?: http.Types;
	IncomingHandler?: http.IncomingHandler;
	OutgoingHandler?: http.OutgoingHandler;
};

export namespace http {
	export namespace Types.$ {
		export const Duration = clocks.MonotonicClock.$.Duration;
		export const InputStream = io.Streams.$.InputStream;
		export const OutputStream = io.Streams.$.OutputStream;
		export const IoError = io.Error.$.Error;
		export const Pollable = io.Poll.$.Pollable;
		export const Method = new $wcm.VariantType<http.Types.Method, http.Types.Method._tt, http.Types.Method._vt>([['get', undefined], ['head', undefined], ['post', undefined], ['put', undefined], ['delete', undefined], ['connect', undefined], ['options', undefined], ['trace', undefined], ['patch', undefined], ['other', $wcm.wstring]], http.Types.Method._ctor);
		export const Scheme = new $wcm.VariantType<http.Types.Scheme, http.Types.Scheme._tt, http.Types.Scheme._vt>([['HTTP', undefined], ['HTTPS', undefined], ['other', $wcm.wstring]], http.Types.Scheme._ctor);
		export const DNSErrorPayload = new $wcm.RecordType<http.Types.DNSErrorPayload>([
			['rcode', new $wcm.OptionType<string>($wcm.wstring)],
			['infoCode', new $wcm.OptionType<u16>($wcm.u16)],
		]);
		export const TLSAlertReceivedPayload = new $wcm.RecordType<http.Types.TLSAlertReceivedPayload>([
			['alertId', new $wcm.OptionType<u8>($wcm.u8)],
			['alertMessage', new $wcm.OptionType<string>($wcm.wstring)],
		]);
		export const FieldSizePayload = new $wcm.RecordType<http.Types.FieldSizePayload>([
			['fieldName', new $wcm.OptionType<string>($wcm.wstring)],
			['fieldSize', new $wcm.OptionType<u32>($wcm.u32)],
		]);
		export const ErrorCode = new $wcm.VariantType<http.Types.ErrorCode, http.Types.ErrorCode._tt, http.Types.ErrorCode._vt>([['DNSTimeout', undefined], ['DNSError', DNSErrorPayload], ['destinationNotFound', undefined], ['destinationUnavailable', undefined], ['destinationIPProhibited', undefined], ['destinationIPUnroutable', undefined], ['connectionRefused', undefined], ['connectionTerminated', undefined], ['connectionTimeout', undefined], ['connectionReadTimeout', undefined], ['connectionWriteTimeout', undefined], ['connectionLimitReached', undefined], ['TLSProtocolError', undefined], ['TLSCertificateError', undefined], ['TLSAlertReceived', TLSAlertReceivedPayload], ['HTTPRequestDenied', undefined], ['HTTPRequestLengthRequired', undefined], ['HTTPRequestBodySize', new $wcm.OptionType<u64>($wcm.u64)], ['HTTPRequestMethodInvalid', undefined], ['HTTPRequestURIInvalid', undefined], ['HTTPRequestURITooLong', undefined], ['HTTPRequestHeaderSectionSize', new $wcm.OptionType<u32>($wcm.u32)], ['HTTPRequestHeaderSize', new $wcm.OptionType<http.Types.FieldSizePayload>(FieldSizePayload)], ['HTTPRequestTrailerSectionSize', new $wcm.OptionType<u32>($wcm.u32)], ['HTTPRequestTrailerSize', FieldSizePayload], ['HTTPResponseIncomplete', undefined], ['HTTPResponseHeaderSectionSize', new $wcm.OptionType<u32>($wcm.u32)], ['HTTPResponseHeaderSize', FieldSizePayload], ['HTTPResponseBodySize', new $wcm.OptionType<u64>($wcm.u64)], ['HTTPResponseTrailerSectionSize', new $wcm.OptionType<u32>($wcm.u32)], ['HTTPResponseTrailerSize', FieldSizePayload], ['HTTPResponseTransferCoding', new $wcm.OptionType<string>($wcm.wstring)], ['HTTPResponseContentCoding', new $wcm.OptionType<string>($wcm.wstring)], ['HTTPResponseTimeout', undefined], ['HTTPUpgradeFailed', undefined], ['HTTPProtocolError', undefined], ['loopDetected', undefined], ['configurationError', undefined], ['internalError', new $wcm.OptionType<string>($wcm.wstring)]], http.Types.ErrorCode._ctor);
		export const HeaderError = new $wcm.VariantType<http.Types.HeaderError, http.Types.HeaderError._tt, http.Types.HeaderError._vt>([['invalidSyntax', undefined], ['forbidden', undefined], ['immutable', undefined]], http.Types.HeaderError._ctor);
		export const FieldKey = $wcm.wstring;
		export const FieldValue = new $wcm.Uint8ArrayType();
		export const Fields = new $wcm.ResourceType<http.Types.Fields>('fields', 'wasi:http/types/fields');
		export const Fields_Handle = new $wcm.ResourceHandleType('fields');
		export const Headers = Fields;
		export const Trailers = Fields;
		export const IncomingRequest = new $wcm.ResourceType<http.Types.IncomingRequest>('incoming-request', 'wasi:http/types/incoming-request');
		export const IncomingRequest_Handle = new $wcm.ResourceHandleType('incoming-request');
		export const OutgoingRequest = new $wcm.ResourceType<http.Types.OutgoingRequest>('outgoing-request', 'wasi:http/types/outgoing-request');
		export const OutgoingRequest_Handle = new $wcm.ResourceHandleType('outgoing-request');
		export const RequestOptions = new $wcm.ResourceType<http.Types.RequestOptions>('request-options', 'wasi:http/types/request-options');
		export const RequestOptions_Handle = new $wcm.ResourceHandleType('request-options');
		export const ResponseOutparam = new $wcm.ResourceType<http.Types.ResponseOutparam>('response-outparam', 'wasi:http/types/response-outparam');
		export const ResponseOutparam_Handle = new $wcm.ResourceHandleType('response-outparam');
		export const StatusCode = $wcm.u16;
		export const IncomingResponse = new $wcm.ResourceType<http.Types.IncomingResponse>('incoming-response', 'wasi:http/types/incoming-response');
		export const IncomingResponse_Handle = new $wcm.ResourceHandleType('incoming-response');
		export const IncomingBody = new $wcm.ResourceType<http.Types.IncomingBody>('incoming-body', 'wasi:http/types/incoming-body');
		export const IncomingBody_Handle = new $wcm.ResourceHandleType('incoming-body');
		export const FutureTrailers = new $wcm.ResourceType<http.Types.FutureTrailers>('future-trailers', 'wasi:http/types/future-trailers');
		export const FutureTrailers_Handle = new $wcm.ResourceHandleType('future-trailers');
		export const OutgoingResponse = new $wcm.ResourceType<http.Types.OutgoingResponse>('outgoing-response', 'wasi:http/types/outgoing-response');
		export const OutgoingResponse_Handle = new $wcm.ResourceHandleType('outgoing-response');
		export const OutgoingBody = new $wcm.ResourceType<http.Types.OutgoingBody>('outgoing-body', 'wasi:http/types/outgoing-body');
		export const OutgoingBody_Handle = new $wcm.ResourceHandleType('outgoing-body');
		export const FutureIncomingResponse = new $wcm.ResourceType<http.Types.FutureIncomingResponse>('future-incoming-response', 'wasi:http/types/future-incoming-response');
		export const FutureIncomingResponse_Handle = new $wcm.ResourceHandleType('future-incoming-response');
		Fields.addCallable('constructor', new $wcm.ConstructorType<http.Types.Fields.Class['constructor']>('[constructor]fields', [], new $wcm.OwnType(Fields_Handle)));
		Fields.addCallable('fromList', new $wcm.StaticMethodType<http.Types.Fields.Statics['fromList']>('[static]fields.from-list', [
			['entries', new $wcm.ListType<[http.Types.FieldKey, Uint8Array]>(new $wcm.TupleType<[http.Types.FieldKey, Uint8Array]>([FieldKey, FieldValue]))],
		], new $wcm.ResultType<own<http.Types.Fields>, http.Types.HeaderError>(new $wcm.OwnType<http.Types.Fields>(Fields), HeaderError)));
		Fields.addCallable('get', new $wcm.MethodType<http.Types.Fields.Interface['get']>('[method]fields.get', [
			['self', new $wcm.BorrowType<http.Types.Fields>(Fields)],
			['name', FieldKey],
		], new $wcm.ListType<Uint8Array>(FieldValue)));
		Fields.addCallable('has', new $wcm.MethodType<http.Types.Fields.Interface['has']>('[method]fields.has', [
			['self', new $wcm.BorrowType<http.Types.Fields>(Fields)],
			['name', FieldKey],
		], $wcm.bool));
		Fields.addCallable('set', new $wcm.MethodType<http.Types.Fields.Interface['set']>('[method]fields.set', [
			['self', new $wcm.BorrowType<http.Types.Fields>(Fields)],
			['name', FieldKey],
			['value', new $wcm.ListType<Uint8Array>(FieldValue)],
		], new $wcm.ResultType<void, http.Types.HeaderError>(undefined, HeaderError)));
		Fields.addCallable('delete', new $wcm.MethodType<http.Types.Fields.Interface['delete']>('[method]fields.delete', [
			['self', new $wcm.BorrowType<http.Types.Fields>(Fields)],
			['name', FieldKey],
		], new $wcm.ResultType<void, http.Types.HeaderError>(undefined, HeaderError)));
		Fields.addCallable('append', new $wcm.MethodType<http.Types.Fields.Interface['append']>('[method]fields.append', [
			['self', new $wcm.BorrowType<http.Types.Fields>(Fields)],
			['name', FieldKey],
			['value', FieldValue],
		], new $wcm.ResultType<void, http.Types.HeaderError>(undefined, HeaderError)));
		Fields.addCallable('entries', new $wcm.MethodType<http.Types.Fields.Interface['entries']>('[method]fields.entries', [
			['self', new $wcm.BorrowType<http.Types.Fields>(Fields)],
		], new $wcm.ListType<[http.Types.FieldKey, Uint8Array]>(new $wcm.TupleType<[http.Types.FieldKey, Uint8Array]>([FieldKey, FieldValue]))));
		Fields.addCallable('clone', new $wcm.MethodType<http.Types.Fields.Interface['clone']>('[method]fields.clone', [
			['self', new $wcm.BorrowType<http.Types.Fields>(Fields)],
		], new $wcm.OwnType<http.Types.Fields>(Fields)));
		Fields.addCallable('$drop', new $wcm.DestructorType<http.Types.Fields.Statics['$drop']>('[resource-drop]fields', [['inst', Fields]]));
		IncomingRequest.addCallable('method', new $wcm.MethodType<http.Types.IncomingRequest.Interface['method']>('[method]incoming-request.method', [
			['self', new $wcm.BorrowType<http.Types.IncomingRequest>(IncomingRequest)],
		], Method));
		IncomingRequest.addCallable('pathWithQuery', new $wcm.MethodType<http.Types.IncomingRequest.Interface['pathWithQuery']>('[method]incoming-request.path-with-query', [
			['self', new $wcm.BorrowType<http.Types.IncomingRequest>(IncomingRequest)],
		], new $wcm.OptionType<string>($wcm.wstring)));
		IncomingRequest.addCallable('scheme', new $wcm.MethodType<http.Types.IncomingRequest.Interface['scheme']>('[method]incoming-request.scheme', [
			['self', new $wcm.BorrowType<http.Types.IncomingRequest>(IncomingRequest)],
		], new $wcm.OptionType<http.Types.Scheme>(Scheme)));
		IncomingRequest.addCallable('authority', new $wcm.MethodType<http.Types.IncomingRequest.Interface['authority']>('[method]incoming-request.authority', [
			['self', new $wcm.BorrowType<http.Types.IncomingRequest>(IncomingRequest)],
		], new $wcm.OptionType<string>($wcm.wstring)));
		IncomingRequest.addCallable('headers', new $wcm.MethodType<http.Types.IncomingRequest.Interface['headers']>('[method]incoming-request.headers', [
			['self', new $wcm.BorrowType<http.Types.IncomingRequest>(IncomingRequest)],
		], new $wcm.OwnType<http.Types.Headers>(Headers)));
		IncomingRequest.addCallable('consume', new $wcm.MethodType<http.Types.IncomingRequest.Interface['consume']>('[method]incoming-request.consume', [
			['self', new $wcm.BorrowType<http.Types.IncomingRequest>(IncomingRequest)],
		], new $wcm.ResultType<own<http.Types.IncomingBody>, void>(new $wcm.OwnType<http.Types.IncomingBody>(IncomingBody), undefined)));
		IncomingRequest.addCallable('$drop', new $wcm.DestructorType<http.Types.IncomingRequest.Statics['$drop']>('[resource-drop]incoming-request', [['inst', IncomingRequest]]));
		OutgoingRequest.addCallable('constructor', new $wcm.ConstructorType<http.Types.OutgoingRequest.Class['constructor']>('[constructor]outgoing-request', [
			['headers', new $wcm.OwnType<http.Types.Headers>(Headers)],
		], new $wcm.OwnType(OutgoingRequest_Handle)));
		OutgoingRequest.addCallable('body', new $wcm.MethodType<http.Types.OutgoingRequest.Interface['body']>('[method]outgoing-request.body', [
			['self', new $wcm.BorrowType<http.Types.OutgoingRequest>(OutgoingRequest)],
		], new $wcm.ResultType<own<http.Types.OutgoingBody>, void>(new $wcm.OwnType<http.Types.OutgoingBody>(OutgoingBody), undefined)));
		OutgoingRequest.addCallable('method', new $wcm.MethodType<http.Types.OutgoingRequest.Interface['method']>('[method]outgoing-request.method', [
			['self', new $wcm.BorrowType<http.Types.OutgoingRequest>(OutgoingRequest)],
		], Method));
		OutgoingRequest.addCallable('setMethod', new $wcm.MethodType<http.Types.OutgoingRequest.Interface['setMethod']>('[method]outgoing-request.set-method', [
			['self', new $wcm.BorrowType<http.Types.OutgoingRequest>(OutgoingRequest)],
			['method', Method],
		], new $wcm.ResultType<void, void>(undefined, undefined)));
		OutgoingRequest.addCallable('pathWithQuery', new $wcm.MethodType<http.Types.OutgoingRequest.Interface['pathWithQuery']>('[method]outgoing-request.path-with-query', [
			['self', new $wcm.BorrowType<http.Types.OutgoingRequest>(OutgoingRequest)],
		], new $wcm.OptionType<string>($wcm.wstring)));
		OutgoingRequest.addCallable('setPathWithQuery', new $wcm.MethodType<http.Types.OutgoingRequest.Interface['setPathWithQuery']>('[method]outgoing-request.set-path-with-query', [
			['self', new $wcm.BorrowType<http.Types.OutgoingRequest>(OutgoingRequest)],
			['pathWithQuery', new $wcm.OptionType<string>($wcm.wstring)],
		], new $wcm.ResultType<void, void>(undefined, undefined)));
		OutgoingRequest.addCallable('scheme', new $wcm.MethodType<http.Types.OutgoingRequest.Interface['scheme']>('[method]outgoing-request.scheme', [
			['self', new $wcm.BorrowType<http.Types.OutgoingRequest>(OutgoingRequest)],
		], new $wcm.OptionType<http.Types.Scheme>(Scheme)));
		OutgoingRequest.addCallable('setScheme', new $wcm.MethodType<http.Types.OutgoingRequest.Interface['setScheme']>('[method]outgoing-request.set-scheme', [
			['self', new $wcm.BorrowType<http.Types.OutgoingRequest>(OutgoingRequest)],
			['scheme', new $wcm.OptionType<http.Types.Scheme>(Scheme)],
		], new $wcm.ResultType<void, void>(undefined, undefined)));
		OutgoingRequest.addCallable('authority', new $wcm.MethodType<http.Types.OutgoingRequest.Interface['authority']>('[method]outgoing-request.authority', [
			['self', new $wcm.BorrowType<http.Types.OutgoingRequest>(OutgoingRequest)],
		], new $wcm.OptionType<string>($wcm.wstring)));
		OutgoingRequest.addCallable('setAuthority', new $wcm.MethodType<http.Types.OutgoingRequest.Interface['setAuthority']>('[method]outgoing-request.set-authority', [
			['self', new $wcm.BorrowType<http.Types.OutgoingRequest>(OutgoingRequest)],
			['authority', new $wcm.OptionType<string>($wcm.wstring)],
		], new $wcm.ResultType<void, void>(undefined, undefined)));
		OutgoingRequest.addCallable('headers', new $wcm.MethodType<http.Types.OutgoingRequest.Interface['headers']>('[method]outgoing-request.headers', [
			['self', new $wcm.BorrowType<http.Types.OutgoingRequest>(OutgoingRequest)],
		], new $wcm.OwnType<http.Types.Headers>(Headers)));
		OutgoingRequest.addCallable('$drop', new $wcm.DestructorType<http.Types.OutgoingRequest.Statics['$drop']>('[resource-drop]outgoing-request', [['inst', OutgoingRequest]]));
		RequestOptions.addCallable('constructor', new $wcm.ConstructorType<http.Types.RequestOptions.Class['constructor']>('[constructor]request-options', [], new $wcm.OwnType(RequestOptions_Handle)));
		RequestOptions.addCallable('connectTimeout', new $wcm.MethodType<http.Types.RequestOptions.Interface['connectTimeout']>('[method]request-options.connect-timeout', [
			['self', new $wcm.BorrowType<http.Types.RequestOptions>(RequestOptions)],
		], new $wcm.OptionType<http.Types.Duration>(Duration)));
		RequestOptions.addCallable('setConnectTimeout', new $wcm.MethodType<http.Types.RequestOptions.Interface['setConnectTimeout']>('[method]request-options.set-connect-timeout', [
			['self', new $wcm.BorrowType<http.Types.RequestOptions>(RequestOptions)],
			['duration', new $wcm.OptionType<http.Types.Duration>(Duration)],
		], new $wcm.ResultType<void, void>(undefined, undefined)));
		RequestOptions.addCallable('firstByteTimeout', new $wcm.MethodType<http.Types.RequestOptions.Interface['firstByteTimeout']>('[method]request-options.first-byte-timeout', [
			['self', new $wcm.BorrowType<http.Types.RequestOptions>(RequestOptions)],
		], new $wcm.OptionType<http.Types.Duration>(Duration)));
		RequestOptions.addCallable('setFirstByteTimeout', new $wcm.MethodType<http.Types.RequestOptions.Interface['setFirstByteTimeout']>('[method]request-options.set-first-byte-timeout', [
			['self', new $wcm.BorrowType<http.Types.RequestOptions>(RequestOptions)],
			['duration', new $wcm.OptionType<http.Types.Duration>(Duration)],
		], new $wcm.ResultType<void, void>(undefined, undefined)));
		RequestOptions.addCallable('betweenBytesTimeout', new $wcm.MethodType<http.Types.RequestOptions.Interface['betweenBytesTimeout']>('[method]request-options.between-bytes-timeout', [
			['self', new $wcm.BorrowType<http.Types.RequestOptions>(RequestOptions)],
		], new $wcm.OptionType<http.Types.Duration>(Duration)));
		RequestOptions.addCallable('setBetweenBytesTimeout', new $wcm.MethodType<http.Types.RequestOptions.Interface['setBetweenBytesTimeout']>('[method]request-options.set-between-bytes-timeout', [
			['self', new $wcm.BorrowType<http.Types.RequestOptions>(RequestOptions)],
			['duration', new $wcm.OptionType<http.Types.Duration>(Duration)],
		], new $wcm.ResultType<void, void>(undefined, undefined)));
		RequestOptions.addCallable('$drop', new $wcm.DestructorType<http.Types.RequestOptions.Statics['$drop']>('[resource-drop]request-options', [['inst', RequestOptions]]));
		ResponseOutparam.addCallable('set', new $wcm.StaticMethodType<http.Types.ResponseOutparam.Statics['set']>('[static]response-outparam.set', [
			['param', new $wcm.OwnType<http.Types.ResponseOutparam>(ResponseOutparam)],
			['response', new $wcm.ResultType<own<http.Types.OutgoingResponse>, http.Types.ErrorCode>(new $wcm.OwnType<http.Types.OutgoingResponse>(OutgoingResponse), ErrorCode)],
		], undefined));
		ResponseOutparam.addCallable('$drop', new $wcm.DestructorType<http.Types.ResponseOutparam.Statics['$drop']>('[resource-drop]response-outparam', [['inst', ResponseOutparam]]));
		IncomingResponse.addCallable('status', new $wcm.MethodType<http.Types.IncomingResponse.Interface['status']>('[method]incoming-response.status', [
			['self', new $wcm.BorrowType<http.Types.IncomingResponse>(IncomingResponse)],
		], StatusCode));
		IncomingResponse.addCallable('headers', new $wcm.MethodType<http.Types.IncomingResponse.Interface['headers']>('[method]incoming-response.headers', [
			['self', new $wcm.BorrowType<http.Types.IncomingResponse>(IncomingResponse)],
		], new $wcm.OwnType<http.Types.Headers>(Headers)));
		IncomingResponse.addCallable('consume', new $wcm.MethodType<http.Types.IncomingResponse.Interface['consume']>('[method]incoming-response.consume', [
			['self', new $wcm.BorrowType<http.Types.IncomingResponse>(IncomingResponse)],
		], new $wcm.ResultType<own<http.Types.IncomingBody>, void>(new $wcm.OwnType<http.Types.IncomingBody>(IncomingBody), undefined)));
		IncomingResponse.addCallable('$drop', new $wcm.DestructorType<http.Types.IncomingResponse.Statics['$drop']>('[resource-drop]incoming-response', [['inst', IncomingResponse]]));
		IncomingBody.addCallable('stream', new $wcm.MethodType<http.Types.IncomingBody.Interface['stream']>('[method]incoming-body.stream', [
			['self', new $wcm.BorrowType<http.Types.IncomingBody>(IncomingBody)],
		], new $wcm.ResultType<own<http.Types.InputStream>, void>(new $wcm.OwnType<http.Types.InputStream>(InputStream), undefined)));
		IncomingBody.addCallable('finish', new $wcm.StaticMethodType<http.Types.IncomingBody.Statics['finish']>('[static]incoming-body.finish', [
			['this_', new $wcm.OwnType<http.Types.IncomingBody>(IncomingBody)],
		], new $wcm.OwnType<http.Types.FutureTrailers>(FutureTrailers)));
		IncomingBody.addCallable('$drop', new $wcm.DestructorType<http.Types.IncomingBody.Statics['$drop']>('[resource-drop]incoming-body', [['inst', IncomingBody]]));
		FutureTrailers.addCallable('subscribe', new $wcm.MethodType<http.Types.FutureTrailers.Interface['subscribe']>('[method]future-trailers.subscribe', [
			['self', new $wcm.BorrowType<http.Types.FutureTrailers>(FutureTrailers)],
		], new $wcm.OwnType<http.Types.Pollable>(Pollable)));
		FutureTrailers.addCallable('get', new $wcm.MethodType<http.Types.FutureTrailers.Interface['get']>('[method]future-trailers.get', [
			['self', new $wcm.BorrowType<http.Types.FutureTrailers>(FutureTrailers)],
		], new $wcm.OptionType<result<result<option<own<http.Types.Trailers>>, http.Types.ErrorCode>, void>>(new $wcm.ResultType<result<option<own<http.Types.Trailers>>, http.Types.ErrorCode>, void>(new $wcm.ResultType<option<own<http.Types.Trailers>>, http.Types.ErrorCode>(new $wcm.OptionType<own<http.Types.Trailers>>(new $wcm.OwnType<http.Types.Trailers>(Trailers)), ErrorCode), undefined))));
		FutureTrailers.addCallable('$drop', new $wcm.DestructorType<http.Types.FutureTrailers.Statics['$drop']>('[resource-drop]future-trailers', [['inst', FutureTrailers]]));
		OutgoingResponse.addCallable('constructor', new $wcm.ConstructorType<http.Types.OutgoingResponse.Class['constructor']>('[constructor]outgoing-response', [
			['headers', new $wcm.OwnType<http.Types.Headers>(Headers)],
		], new $wcm.OwnType(OutgoingResponse_Handle)));
		OutgoingResponse.addCallable('statusCode', new $wcm.MethodType<http.Types.OutgoingResponse.Interface['statusCode']>('[method]outgoing-response.status-code', [
			['self', new $wcm.BorrowType<http.Types.OutgoingResponse>(OutgoingResponse)],
		], StatusCode));
		OutgoingResponse.addCallable('setStatusCode', new $wcm.MethodType<http.Types.OutgoingResponse.Interface['setStatusCode']>('[method]outgoing-response.set-status-code', [
			['self', new $wcm.BorrowType<http.Types.OutgoingResponse>(OutgoingResponse)],
			['statusCode', StatusCode],
		], new $wcm.ResultType<void, void>(undefined, undefined)));
		OutgoingResponse.addCallable('headers', new $wcm.MethodType<http.Types.OutgoingResponse.Interface['headers']>('[method]outgoing-response.headers', [
			['self', new $wcm.BorrowType<http.Types.OutgoingResponse>(OutgoingResponse)],
		], new $wcm.OwnType<http.Types.Headers>(Headers)));
		OutgoingResponse.addCallable('body', new $wcm.MethodType<http.Types.OutgoingResponse.Interface['body']>('[method]outgoing-response.body', [
			['self', new $wcm.BorrowType<http.Types.OutgoingResponse>(OutgoingResponse)],
		], new $wcm.ResultType<own<http.Types.OutgoingBody>, void>(new $wcm.OwnType<http.Types.OutgoingBody>(OutgoingBody), undefined)));
		OutgoingResponse.addCallable('$drop', new $wcm.DestructorType<http.Types.OutgoingResponse.Statics['$drop']>('[resource-drop]outgoing-response', [['inst', OutgoingResponse]]));
		OutgoingBody.addCallable('write', new $wcm.MethodType<http.Types.OutgoingBody.Interface['write']>('[method]outgoing-body.write', [
			['self', new $wcm.BorrowType<http.Types.OutgoingBody>(OutgoingBody)],
		], new $wcm.ResultType<own<http.Types.OutputStream>, void>(new $wcm.OwnType<http.Types.OutputStream>(OutputStream), undefined)));
		OutgoingBody.addCallable('finish', new $wcm.StaticMethodType<http.Types.OutgoingBody.Statics['finish']>('[static]outgoing-body.finish', [
			['this_', new $wcm.OwnType<http.Types.OutgoingBody>(OutgoingBody)],
			['trailers', new $wcm.OptionType<own<http.Types.Trailers>>(new $wcm.OwnType<http.Types.Trailers>(Trailers))],
		], new $wcm.ResultType<void, http.Types.ErrorCode>(undefined, ErrorCode)));
		OutgoingBody.addCallable('$drop', new $wcm.DestructorType<http.Types.OutgoingBody.Statics['$drop']>('[resource-drop]outgoing-body', [['inst', OutgoingBody]]));
		FutureIncomingResponse.addCallable('subscribe', new $wcm.MethodType<http.Types.FutureIncomingResponse.Interface['subscribe']>('[method]future-incoming-response.subscribe', [
			['self', new $wcm.BorrowType<http.Types.FutureIncomingResponse>(FutureIncomingResponse)],
		], new $wcm.OwnType<http.Types.Pollable>(Pollable)));
		FutureIncomingResponse.addCallable('get', new $wcm.MethodType<http.Types.FutureIncomingResponse.Interface['get']>('[method]future-incoming-response.get', [
			['self', new $wcm.BorrowType<http.Types.FutureIncomingResponse>(FutureIncomingResponse)],
		], new $wcm.OptionType<result<result<own<http.Types.IncomingResponse>, http.Types.ErrorCode>, void>>(new $wcm.ResultType<result<own<http.Types.IncomingResponse>, http.Types.ErrorCode>, void>(new $wcm.ResultType<own<http.Types.IncomingResponse>, http.Types.ErrorCode>(new $wcm.OwnType<http.Types.IncomingResponse>(IncomingResponse), ErrorCode), undefined))));
		FutureIncomingResponse.addCallable('$drop', new $wcm.DestructorType<http.Types.FutureIncomingResponse.Statics['$drop']>('[resource-drop]future-incoming-response', [['inst', FutureIncomingResponse]]));
		export const httpErrorCode = new $wcm.FunctionType<http.Types.httpErrorCode>('http-error-code',[
			['err', new $wcm.BorrowType<http.Types.IoError>(IoError)],
		], new $wcm.OptionType<http.Types.ErrorCode>(ErrorCode));
	}
	export namespace Types._ {
		export const id = 'wasi:http/types' as const;
		export const witName = 'types' as const;
		export const types: Map<string, $wcm.GenericComponentModelType> = new Map<string, $wcm.GenericComponentModelType>([
			['Duration', $.Duration],
			['InputStream', $.InputStream],
			['OutputStream', $.OutputStream],
			['IoError', $.IoError],
			['Pollable', $.Pollable],
			['Method', $.Method],
			['Scheme', $.Scheme],
			['DNSErrorPayload', $.DNSErrorPayload],
			['TLSAlertReceivedPayload', $.TLSAlertReceivedPayload],
			['FieldSizePayload', $.FieldSizePayload],
			['ErrorCode', $.ErrorCode],
			['HeaderError', $.HeaderError],
			['FieldKey', $.FieldKey],
			['FieldValue', $.FieldValue],
			['Headers', $.Headers],
			['Trailers', $.Trailers],
			['StatusCode', $.StatusCode],
			['Fields', $.Fields],
			['IncomingRequest', $.IncomingRequest],
			['OutgoingRequest', $.OutgoingRequest],
			['RequestOptions', $.RequestOptions],
			['ResponseOutparam', $.ResponseOutparam],
			['IncomingResponse', $.IncomingResponse],
			['IncomingBody', $.IncomingBody],
			['FutureTrailers', $.FutureTrailers],
			['OutgoingResponse', $.OutgoingResponse],
			['OutgoingBody', $.OutgoingBody],
			['FutureIncomingResponse', $.FutureIncomingResponse]
		]);
		export const functions: Map<string, $wcm.FunctionType> = new Map([
			['httpErrorCode', $.httpErrorCode]
		]);
		export const resources: Map<string, $wcm.ResourceType> = new Map<string, $wcm.ResourceType>([
			['Fields', $.Fields],
			['IncomingRequest', $.IncomingRequest],
			['OutgoingRequest', $.OutgoingRequest],
			['RequestOptions', $.RequestOptions],
			['ResponseOutparam', $.ResponseOutparam],
			['IncomingResponse', $.IncomingResponse],
			['IncomingBody', $.IncomingBody],
			['FutureTrailers', $.FutureTrailers],
			['OutgoingResponse', $.OutgoingResponse],
			['OutgoingBody', $.OutgoingBody],
			['FutureIncomingResponse', $.FutureIncomingResponse]
		]);
		export namespace Fields {
			export type WasmInterface = {
				'[constructor]fields': () => i32;
				'[static]fields.from-list': (entries_ptr: i32, entries_len: i32, result: ptr<result<own<Fields>, HeaderError>>) => void;
				'[method]fields.get': (self: i32, name_ptr: i32, name_len: i32, result: ptr<FieldValue[]>) => void;
				'[method]fields.has': (self: i32, name_ptr: i32, name_len: i32) => i32;
				'[method]fields.set': (self: i32, name_ptr: i32, name_len: i32, value_ptr: i32, value_len: i32, result: ptr<result<void, HeaderError>>) => void;
				'[method]fields.delete': (self: i32, name_ptr: i32, name_len: i32, result: ptr<result<void, HeaderError>>) => void;
				'[method]fields.append': (self: i32, name_ptr: i32, name_len: i32, value_ptr: i32, value_len: i32, result: ptr<result<void, HeaderError>>) => void;
				'[method]fields.entries': (self: i32, result: ptr<[FieldKey, FieldValue][]>) => void;
				'[method]fields.clone': (self: i32) => i32;
				'[resource-drop]fields': (self: i32) => void;
			};
			type ObjectModule = {
				constructor(): own<$wcm.ResourceHandle>;
				get(self: Fields, name: FieldKey): FieldValue[];
				has(self: Fields, name: FieldKey): boolean;
				set(self: Fields, name: FieldKey, value: FieldValue[]): result<void, HeaderError>;
				delete(self: Fields, name: FieldKey): result<void, HeaderError>;
				append(self: Fields, name: FieldKey, value: FieldValue): result<void, HeaderError>;
				entries(self: Fields): [FieldKey, FieldValue][];
				clone(self: Fields): own<Fields>;
			};
			type ClassModule = {
				fromList(entries: [FieldKey, FieldValue][]): result<own<Fields>, HeaderError>;
				$drop(self: Fields): void;
			};
			class Impl extends $wcm.Resource implements http.Types.Fields.Interface {
				private readonly _om: ObjectModule;
				constructor(om: ObjectModule) {
					super();
					this._om = om;
					this.$handle = om.constructor();
				}
				public get(name: FieldKey): FieldValue[] {
					return this._om.get(this, name);
				}
				public has(name: FieldKey): boolean {
					return this._om.has(this, name);
				}
				public set(name: FieldKey, value: FieldValue[]): result<void, HeaderError> {
					return this._om.set(this, name, value);
				}
				public delete(name: FieldKey): result<void, HeaderError> {
					return this._om.delete(this, name);
				}
				public append(name: FieldKey, value: FieldValue): result<void, HeaderError> {
					return this._om.append(this, name, value);
				}
				public entries(): [FieldKey, FieldValue][] {
					return this._om.entries(this);
				}
				public clone(): own<Fields> {
					return this._om.clone(this);
				}
			}
			export function Class(wasmInterface: WasmInterface, context: $wcm.WasmContext): http.Types.Fields.Class {
				const resource = http.Types.$.Fields;
				const om: ObjectModule = $wcm.Module.createObjectModule(resource, wasmInterface, context);
				const cm: ClassModule = $wcm.Module.createClassModule(resource, wasmInterface, context);
				return class extends Impl {
					constructor() {
						super(om);
					}
					public static $drop(self: Fields): void {
						return cm.$drop(self);
					}
					public static fromList(entries: [FieldKey, FieldValue][]): result<own<Fields>, HeaderError> {
						return cm.fromList(entries);
					}
				};
			}
		}
		export namespace IncomingRequest {
			export type WasmInterface = {
				'[method]incoming-request.method': (self: i32, result: ptr<Method>) => void;
				'[method]incoming-request.path-with-query': (self: i32, result: ptr<string | undefined>) => void;
				'[method]incoming-request.scheme': (self: i32, result: ptr<Scheme | undefined>) => void;
				'[method]incoming-request.authority': (self: i32, result: ptr<string | undefined>) => void;
				'[method]incoming-request.headers': (self: i32) => i32;
				'[method]incoming-request.consume': (self: i32, result: ptr<result<own<IncomingBody>, void>>) => void;
				'[resource-drop]incoming-request': (self: i32) => void;
			};
			type ObjectModule = {
				method(self: IncomingRequest): Method;
				pathWithQuery(self: IncomingRequest): string | undefined;
				scheme(self: IncomingRequest): Scheme | undefined;
				authority(self: IncomingRequest): string | undefined;
				headers(self: IncomingRequest): own<Headers>;
				consume(self: IncomingRequest): result<own<IncomingBody>, void>;
			};
			type ClassModule = {
				$drop(self: IncomingRequest): void;
			};
			class Impl extends $wcm.Resource implements http.Types.IncomingRequest.Interface {
				private readonly _om: ObjectModule;
				constructor(om: ObjectModule) {
					super();
					this._om = om;
				}
				public method(): Method {
					return this._om.method(this);
				}
				public pathWithQuery(): string | undefined {
					return this._om.pathWithQuery(this);
				}
				public scheme(): Scheme | undefined {
					return this._om.scheme(this);
				}
				public authority(): string | undefined {
					return this._om.authority(this);
				}
				public headers(): own<Headers> {
					return this._om.headers(this);
				}
				public consume(): result<own<IncomingBody>, void> {
					return this._om.consume(this);
				}
			}
			export function Class(wasmInterface: WasmInterface, context: $wcm.WasmContext): http.Types.IncomingRequest.Class {
				const resource = http.Types.$.IncomingRequest;
				const om: ObjectModule = $wcm.Module.createObjectModule(resource, wasmInterface, context);
				const cm: ClassModule = $wcm.Module.createClassModule(resource, wasmInterface, context);
				return class extends Impl {
					constructor() {
						super(om);
					}
					public static $drop(self: IncomingRequest): void {
						return cm.$drop(self);
					}
				};
			}
		}
		export namespace OutgoingRequest {
			export type WasmInterface = {
				'[constructor]outgoing-request': (headers: i32) => i32;
				'[method]outgoing-request.body': (self: i32, result: ptr<result<own<OutgoingBody>, void>>) => void;
				'[method]outgoing-request.method': (self: i32, result: ptr<Method>) => void;
				'[method]outgoing-request.set-method': (self: i32, method_case: i32, method_0: i32, method_1: i32) => i32;
				'[method]outgoing-request.path-with-query': (self: i32, result: ptr<string | undefined>) => void;
				'[method]outgoing-request.set-path-with-query': (self: i32, pathWithQuery_case: i32, pathWithQuery_option_ptr: i32, pathWithQuery_option_len: i32) => i32;
				'[method]outgoing-request.scheme': (self: i32, result: ptr<Scheme | undefined>) => void;
				'[method]outgoing-request.set-scheme': (self: i32, scheme_case: i32, scheme_option_case: i32, scheme_option_0: i32, scheme_option_1: i32) => i32;
				'[method]outgoing-request.authority': (self: i32, result: ptr<string | undefined>) => void;
				'[method]outgoing-request.set-authority': (self: i32, authority_case: i32, authority_option_ptr: i32, authority_option_len: i32) => i32;
				'[method]outgoing-request.headers': (self: i32) => i32;
				'[resource-drop]outgoing-request': (self: i32) => void;
			};
			type ObjectModule = {
				constructor(headers: own<Headers>): own<$wcm.ResourceHandle>;
				body(self: OutgoingRequest): result<own<OutgoingBody>, void>;
				method(self: OutgoingRequest): Method;
				setMethod(self: OutgoingRequest, method: Method): result<void, void>;
				pathWithQuery(self: OutgoingRequest): string | undefined;
				setPathWithQuery(self: OutgoingRequest, pathWithQuery: string | undefined): result<void, void>;
				scheme(self: OutgoingRequest): Scheme | undefined;
				setScheme(self: OutgoingRequest, scheme: Scheme | undefined): result<void, void>;
				authority(self: OutgoingRequest): string | undefined;
				setAuthority(self: OutgoingRequest, authority: string | undefined): result<void, void>;
				headers(self: OutgoingRequest): own<Headers>;
			};
			type ClassModule = {
				$drop(self: OutgoingRequest): void;
			};
			class Impl extends $wcm.Resource implements http.Types.OutgoingRequest.Interface {
				private readonly _om: ObjectModule;
				constructor(headers: own<Headers>, om: ObjectModule) {
					super();
					this._om = om;
					this.$handle = om.constructor(headers);
				}
				public body(): result<own<OutgoingBody>, void> {
					return this._om.body(this);
				}
				public method(): Method {
					return this._om.method(this);
				}
				public setMethod(method: Method): result<void, void> {
					return this._om.setMethod(this, method);
				}
				public pathWithQuery(): string | undefined {
					return this._om.pathWithQuery(this);
				}
				public setPathWithQuery(pathWithQuery: string | undefined): result<void, void> {
					return this._om.setPathWithQuery(this, pathWithQuery);
				}
				public scheme(): Scheme | undefined {
					return this._om.scheme(this);
				}
				public setScheme(scheme: Scheme | undefined): result<void, void> {
					return this._om.setScheme(this, scheme);
				}
				public authority(): string | undefined {
					return this._om.authority(this);
				}
				public setAuthority(authority: string | undefined): result<void, void> {
					return this._om.setAuthority(this, authority);
				}
				public headers(): own<Headers> {
					return this._om.headers(this);
				}
			}
			export function Class(wasmInterface: WasmInterface, context: $wcm.WasmContext): http.Types.OutgoingRequest.Class {
				const resource = http.Types.$.OutgoingRequest;
				const om: ObjectModule = $wcm.Module.createObjectModule(resource, wasmInterface, context);
				const cm: ClassModule = $wcm.Module.createClassModule(resource, wasmInterface, context);
				return class extends Impl {
					constructor(headers: own<Headers>) {
						super(headers, om);
					}
					public static $drop(self: OutgoingRequest): void {
						return cm.$drop(self);
					}
				};
			}
		}
		export namespace RequestOptions {
			export type WasmInterface = {
				'[constructor]request-options': () => i32;
				'[method]request-options.connect-timeout': (self: i32, result: ptr<Duration | undefined>) => void;
				'[method]request-options.set-connect-timeout': (self: i32, duration_case: i32, duration_option_Duration: i64) => i32;
				'[method]request-options.first-byte-timeout': (self: i32, result: ptr<Duration | undefined>) => void;
				'[method]request-options.set-first-byte-timeout': (self: i32, duration_case: i32, duration_option_Duration: i64) => i32;
				'[method]request-options.between-bytes-timeout': (self: i32, result: ptr<Duration | undefined>) => void;
				'[method]request-options.set-between-bytes-timeout': (self: i32, duration_case: i32, duration_option_Duration: i64) => i32;
				'[resource-drop]request-options': (self: i32) => void;
			};
			type ObjectModule = {
				constructor(): own<$wcm.ResourceHandle>;
				connectTimeout(self: RequestOptions): Duration | undefined;
				setConnectTimeout(self: RequestOptions, duration: Duration | undefined): result<void, void>;
				firstByteTimeout(self: RequestOptions): Duration | undefined;
				setFirstByteTimeout(self: RequestOptions, duration: Duration | undefined): result<void, void>;
				betweenBytesTimeout(self: RequestOptions): Duration | undefined;
				setBetweenBytesTimeout(self: RequestOptions, duration: Duration | undefined): result<void, void>;
			};
			type ClassModule = {
				$drop(self: RequestOptions): void;
			};
			class Impl extends $wcm.Resource implements http.Types.RequestOptions.Interface {
				private readonly _om: ObjectModule;
				constructor(om: ObjectModule) {
					super();
					this._om = om;
					this.$handle = om.constructor();
				}
				public connectTimeout(): Duration | undefined {
					return this._om.connectTimeout(this);
				}
				public setConnectTimeout(duration: Duration | undefined): result<void, void> {
					return this._om.setConnectTimeout(this, duration);
				}
				public firstByteTimeout(): Duration | undefined {
					return this._om.firstByteTimeout(this);
				}
				public setFirstByteTimeout(duration: Duration | undefined): result<void, void> {
					return this._om.setFirstByteTimeout(this, duration);
				}
				public betweenBytesTimeout(): Duration | undefined {
					return this._om.betweenBytesTimeout(this);
				}
				public setBetweenBytesTimeout(duration: Duration | undefined): result<void, void> {
					return this._om.setBetweenBytesTimeout(this, duration);
				}
			}
			export function Class(wasmInterface: WasmInterface, context: $wcm.WasmContext): http.Types.RequestOptions.Class {
				const resource = http.Types.$.RequestOptions;
				const om: ObjectModule = $wcm.Module.createObjectModule(resource, wasmInterface, context);
				const cm: ClassModule = $wcm.Module.createClassModule(resource, wasmInterface, context);
				return class extends Impl {
					constructor() {
						super(om);
					}
					public static $drop(self: RequestOptions): void {
						return cm.$drop(self);
					}
				};
			}
		}
		export namespace ResponseOutparam {
			export type WasmInterface = {
				'[static]response-outparam.set': (param: i32, response_case: i32, response_0: i32, response_1: i32, response_2: i64, response_3: i32, response_4: i32, response_5: i32, response_6: i32) => void;
				'[resource-drop]response-outparam': (self: i32) => void;
			};
			type ClassModule = {
				set(param: own<ResponseOutparam>, response: result<own<OutgoingResponse>, ErrorCode>): void;
				$drop(self: ResponseOutparam): void;
			};
			class Impl extends $wcm.Resource implements http.Types.ResponseOutparam.Interface {
			}
			export function Class(wasmInterface: WasmInterface, context: $wcm.WasmContext): http.Types.ResponseOutparam.Class {
				const resource = http.Types.$.ResponseOutparam;
				const cm: ClassModule = $wcm.Module.createClassModule(resource, wasmInterface, context);
				return class extends Impl {
					public static $drop(self: ResponseOutparam): void {
						return cm.$drop(self);
					}
					public static set(param: own<ResponseOutparam>, response: result<own<OutgoingResponse>, ErrorCode>): void {
						return cm.set(param, response);
					}
				};
			}
		}
		export namespace IncomingResponse {
			export type WasmInterface = {
				'[method]incoming-response.status': (self: i32) => i32;
				'[method]incoming-response.headers': (self: i32) => i32;
				'[method]incoming-response.consume': (self: i32, result: ptr<result<own<IncomingBody>, void>>) => void;
				'[resource-drop]incoming-response': (self: i32) => void;
			};
			type ObjectModule = {
				status(self: IncomingResponse): StatusCode;
				headers(self: IncomingResponse): own<Headers>;
				consume(self: IncomingResponse): result<own<IncomingBody>, void>;
			};
			type ClassModule = {
				$drop(self: IncomingResponse): void;
			};
			class Impl extends $wcm.Resource implements http.Types.IncomingResponse.Interface {
				private readonly _om: ObjectModule;
				constructor(om: ObjectModule) {
					super();
					this._om = om;
				}
				public status(): StatusCode {
					return this._om.status(this);
				}
				public headers(): own<Headers> {
					return this._om.headers(this);
				}
				public consume(): result<own<IncomingBody>, void> {
					return this._om.consume(this);
				}
			}
			export function Class(wasmInterface: WasmInterface, context: $wcm.WasmContext): http.Types.IncomingResponse.Class {
				const resource = http.Types.$.IncomingResponse;
				const om: ObjectModule = $wcm.Module.createObjectModule(resource, wasmInterface, context);
				const cm: ClassModule = $wcm.Module.createClassModule(resource, wasmInterface, context);
				return class extends Impl {
					constructor() {
						super(om);
					}
					public static $drop(self: IncomingResponse): void {
						return cm.$drop(self);
					}
				};
			}
		}
		export namespace IncomingBody {
			export type WasmInterface = {
				'[method]incoming-body.stream': (self: i32, result: ptr<result<own<InputStream>, void>>) => void;
				'[static]incoming-body.finish': (this_: i32) => i32;
				'[resource-drop]incoming-body': (self: i32) => void;
			};
			type ObjectModule = {
				stream(self: IncomingBody): result<own<InputStream>, void>;
			};
			type ClassModule = {
				finish(this_: own<IncomingBody>): own<FutureTrailers>;
				$drop(self: IncomingBody): void;
			};
			class Impl extends $wcm.Resource implements http.Types.IncomingBody.Interface {
				private readonly _om: ObjectModule;
				constructor(om: ObjectModule) {
					super();
					this._om = om;
				}
				public stream(): result<own<InputStream>, void> {
					return this._om.stream(this);
				}
			}
			export function Class(wasmInterface: WasmInterface, context: $wcm.WasmContext): http.Types.IncomingBody.Class {
				const resource = http.Types.$.IncomingBody;
				const om: ObjectModule = $wcm.Module.createObjectModule(resource, wasmInterface, context);
				const cm: ClassModule = $wcm.Module.createClassModule(resource, wasmInterface, context);
				return class extends Impl {
					constructor() {
						super(om);
					}
					public static $drop(self: IncomingBody): void {
						return cm.$drop(self);
					}
					public static finish(this_: own<IncomingBody>): own<FutureTrailers> {
						return cm.finish(this_);
					}
				};
			}
		}
		export namespace FutureTrailers {
			export type WasmInterface = {
				'[method]future-trailers.subscribe': (self: i32) => i32;
				'[method]future-trailers.get': (self: i32, result: ptr<result<result<own<Trailers> | undefined, ErrorCode>, void> | undefined>) => void;
				'[resource-drop]future-trailers': (self: i32) => void;
			};
			type ObjectModule = {
				subscribe(self: FutureTrailers): own<Pollable>;
				get(self: FutureTrailers): result<result<own<Trailers> | undefined, ErrorCode>, void> | undefined;
			};
			type ClassModule = {
				$drop(self: FutureTrailers): void;
			};
			class Impl extends $wcm.Resource implements http.Types.FutureTrailers.Interface {
				private readonly _om: ObjectModule;
				constructor(om: ObjectModule) {
					super();
					this._om = om;
				}
				public subscribe(): own<Pollable> {
					return this._om.subscribe(this);
				}
				public get(): result<result<own<Trailers> | undefined, ErrorCode>, void> | undefined {
					return this._om.get(this);
				}
			}
			export function Class(wasmInterface: WasmInterface, context: $wcm.WasmContext): http.Types.FutureTrailers.Class {
				const resource = http.Types.$.FutureTrailers;
				const om: ObjectModule = $wcm.Module.createObjectModule(resource, wasmInterface, context);
				const cm: ClassModule = $wcm.Module.createClassModule(resource, wasmInterface, context);
				return class extends Impl {
					constructor() {
						super(om);
					}
					public static $drop(self: FutureTrailers): void {
						return cm.$drop(self);
					}
				};
			}
		}
		export namespace OutgoingResponse {
			export type WasmInterface = {
				'[constructor]outgoing-response': (headers: i32) => i32;
				'[method]outgoing-response.status-code': (self: i32) => i32;
				'[method]outgoing-response.set-status-code': (self: i32, statusCode: i32) => i32;
				'[method]outgoing-response.headers': (self: i32) => i32;
				'[method]outgoing-response.body': (self: i32, result: ptr<result<own<OutgoingBody>, void>>) => void;
				'[resource-drop]outgoing-response': (self: i32) => void;
			};
			type ObjectModule = {
				constructor(headers: own<Headers>): own<$wcm.ResourceHandle>;
				statusCode(self: OutgoingResponse): StatusCode;
				setStatusCode(self: OutgoingResponse, statusCode: StatusCode): result<void, void>;
				headers(self: OutgoingResponse): own<Headers>;
				body(self: OutgoingResponse): result<own<OutgoingBody>, void>;
			};
			type ClassModule = {
				$drop(self: OutgoingResponse): void;
			};
			class Impl extends $wcm.Resource implements http.Types.OutgoingResponse.Interface {
				private readonly _om: ObjectModule;
				constructor(headers: own<Headers>, om: ObjectModule) {
					super();
					this._om = om;
					this.$handle = om.constructor(headers);
				}
				public statusCode(): StatusCode {
					return this._om.statusCode(this);
				}
				public setStatusCode(statusCode: StatusCode): result<void, void> {
					return this._om.setStatusCode(this, statusCode);
				}
				public headers(): own<Headers> {
					return this._om.headers(this);
				}
				public body(): result<own<OutgoingBody>, void> {
					return this._om.body(this);
				}
			}
			export function Class(wasmInterface: WasmInterface, context: $wcm.WasmContext): http.Types.OutgoingResponse.Class {
				const resource = http.Types.$.OutgoingResponse;
				const om: ObjectModule = $wcm.Module.createObjectModule(resource, wasmInterface, context);
				const cm: ClassModule = $wcm.Module.createClassModule(resource, wasmInterface, context);
				return class extends Impl {
					constructor(headers: own<Headers>) {
						super(headers, om);
					}
					public static $drop(self: OutgoingResponse): void {
						return cm.$drop(self);
					}
				};
			}
		}
		export namespace OutgoingBody {
			export type WasmInterface = {
				'[method]outgoing-body.write': (self: i32, result: ptr<result<own<OutputStream>, void>>) => void;
				'[static]outgoing-body.finish': (this_: i32, trailers_case: i32, trailers_option: i32, result: ptr<result<void, ErrorCode>>) => void;
				'[resource-drop]outgoing-body': (self: i32) => void;
			};
			type ObjectModule = {
				write(self: OutgoingBody): result<own<OutputStream>, void>;
			};
			type ClassModule = {
				finish(this_: own<OutgoingBody>, trailers: own<Trailers> | undefined): result<void, ErrorCode>;
				$drop(self: OutgoingBody): void;
			};
			class Impl extends $wcm.Resource implements http.Types.OutgoingBody.Interface {
				private readonly _om: ObjectModule;
				constructor(om: ObjectModule) {
					super();
					this._om = om;
				}
				public write(): result<own<OutputStream>, void> {
					return this._om.write(this);
				}
			}
			export function Class(wasmInterface: WasmInterface, context: $wcm.WasmContext): http.Types.OutgoingBody.Class {
				const resource = http.Types.$.OutgoingBody;
				const om: ObjectModule = $wcm.Module.createObjectModule(resource, wasmInterface, context);
				const cm: ClassModule = $wcm.Module.createClassModule(resource, wasmInterface, context);
				return class extends Impl {
					constructor() {
						super(om);
					}
					public static $drop(self: OutgoingBody): void {
						return cm.$drop(self);
					}
					public static finish(this_: own<OutgoingBody>, trailers: own<Trailers> | undefined): result<void, ErrorCode> {
						return cm.finish(this_, trailers);
					}
				};
			}
		}
		export namespace FutureIncomingResponse {
			export type WasmInterface = {
				'[method]future-incoming-response.subscribe': (self: i32) => i32;
				'[method]future-incoming-response.get': (self: i32, result: ptr<result<result<own<IncomingResponse>, ErrorCode>, void> | undefined>) => void;
				'[resource-drop]future-incoming-response': (self: i32) => void;
			};
			type ObjectModule = {
				subscribe(self: FutureIncomingResponse): own<Pollable>;
				get(self: FutureIncomingResponse): result<result<own<IncomingResponse>, ErrorCode>, void> | undefined;
			};
			type ClassModule = {
				$drop(self: FutureIncomingResponse): void;
			};
			class Impl extends $wcm.Resource implements http.Types.FutureIncomingResponse.Interface {
				private readonly _om: ObjectModule;
				constructor(om: ObjectModule) {
					super();
					this._om = om;
				}
				public subscribe(): own<Pollable> {
					return this._om.subscribe(this);
				}
				public get(): result<result<own<IncomingResponse>, ErrorCode>, void> | undefined {
					return this._om.get(this);
				}
			}
			export function Class(wasmInterface: WasmInterface, context: $wcm.WasmContext): http.Types.FutureIncomingResponse.Class {
				const resource = http.Types.$.FutureIncomingResponse;
				const om: ObjectModule = $wcm.Module.createObjectModule(resource, wasmInterface, context);
				const cm: ClassModule = $wcm.Module.createClassModule(resource, wasmInterface, context);
				return class extends Impl {
					constructor() {
						super(om);
					}
					public static $drop(self: FutureIncomingResponse): void {
						return cm.$drop(self);
					}
				};
			}
		}
		export type WasmInterface = {
			'http-error-code': (err: i32, result: ptr<ErrorCode | undefined>) => void;
		} & Fields.WasmInterface & IncomingRequest.WasmInterface & OutgoingRequest.WasmInterface & RequestOptions.WasmInterface & ResponseOutparam.WasmInterface & IncomingResponse.WasmInterface & IncomingBody.WasmInterface & FutureTrailers.WasmInterface & OutgoingResponse.WasmInterface & OutgoingBody.WasmInterface & FutureIncomingResponse.WasmInterface;
		export function createHost(service: http.Types, context: $wcm.WasmContext): WasmInterface {
			return $wcm.Host.create<WasmInterface>(functions, resources, service, context);
		}
		export function createService(wasmInterface: WasmInterface, context: $wcm.WasmContext): http.Types {
			return $wcm.Service.create<http.Types>(functions, [['Fields', $.Fields, Fields.Class], ['IncomingRequest', $.IncomingRequest, IncomingRequest.Class], ['OutgoingRequest', $.OutgoingRequest, OutgoingRequest.Class], ['RequestOptions', $.RequestOptions, RequestOptions.Class], ['ResponseOutparam', $.ResponseOutparam, ResponseOutparam.Class], ['IncomingResponse', $.IncomingResponse, IncomingResponse.Class], ['IncomingBody', $.IncomingBody, IncomingBody.Class], ['FutureTrailers', $.FutureTrailers, FutureTrailers.Class], ['OutgoingResponse', $.OutgoingResponse, OutgoingResponse.Class], ['OutgoingBody', $.OutgoingBody, OutgoingBody.Class], ['FutureIncomingResponse', $.FutureIncomingResponse, FutureIncomingResponse.Class]], wasmInterface, context);
		}
	}

	export namespace IncomingHandler.$ {
		export const IncomingRequest = http.Types.$.IncomingRequest;
		export const ResponseOutparam = http.Types.$.ResponseOutparam;
		export const handle = new $wcm.FunctionType<http.IncomingHandler.handle>('handle',[
			['request', new $wcm.OwnType<http.IncomingHandler.IncomingRequest>(IncomingRequest)],
			['responseOut', new $wcm.OwnType<http.IncomingHandler.ResponseOutparam>(ResponseOutparam)],
		], undefined);
	}
	export namespace IncomingHandler._ {
		export const id = 'wasi:http/incoming-handler' as const;
		export const witName = 'incoming-handler' as const;
		export const types: Map<string, $wcm.GenericComponentModelType> = new Map<string, $wcm.GenericComponentModelType>([
			['IncomingRequest', $.IncomingRequest],
			['ResponseOutparam', $.ResponseOutparam]
		]);
		export const functions: Map<string, $wcm.FunctionType> = new Map([
			['handle', $.handle]
		]);
		export const resources: Map<string, $wcm.ResourceType> = new Map<string, $wcm.ResourceType>([
		]);
		export type WasmInterface = {
			'handle': (request: i32, responseOut: i32) => void;
		};
		export function createHost(service: http.IncomingHandler, context: $wcm.WasmContext): WasmInterface {
			return $wcm.Host.create<WasmInterface>(functions, resources, service, context);
		}
		export function createService(wasmInterface: WasmInterface, context: $wcm.WasmContext): http.IncomingHandler {
			return $wcm.Service.create<http.IncomingHandler>(functions, [], wasmInterface, context);
		}
	}

	export namespace OutgoingHandler.$ {
		export const OutgoingRequest = http.Types.$.OutgoingRequest;
		export const RequestOptions = http.Types.$.RequestOptions;
		export const FutureIncomingResponse = http.Types.$.FutureIncomingResponse;
		export const ErrorCode = http.Types.$.ErrorCode;
		export const handle = new $wcm.FunctionType<http.OutgoingHandler.handle>('handle',[
			['request', new $wcm.OwnType<http.OutgoingHandler.OutgoingRequest>(OutgoingRequest)],
			['options', new $wcm.OptionType<own<http.OutgoingHandler.RequestOptions>>(new $wcm.OwnType<http.OutgoingHandler.RequestOptions>(RequestOptions))],
		], new $wcm.ResultType<own<http.OutgoingHandler.FutureIncomingResponse>, http.OutgoingHandler.ErrorCode>(new $wcm.OwnType<http.OutgoingHandler.FutureIncomingResponse>(FutureIncomingResponse), ErrorCode));
	}
	export namespace OutgoingHandler._ {
		export const id = 'wasi:http/outgoing-handler' as const;
		export const witName = 'outgoing-handler' as const;
		export const types: Map<string, $wcm.GenericComponentModelType> = new Map<string, $wcm.GenericComponentModelType>([
			['OutgoingRequest', $.OutgoingRequest],
			['RequestOptions', $.RequestOptions],
			['FutureIncomingResponse', $.FutureIncomingResponse],
			['ErrorCode', $.ErrorCode]
		]);
		export const functions: Map<string, $wcm.FunctionType> = new Map([
			['handle', $.handle]
		]);
		export const resources: Map<string, $wcm.ResourceType> = new Map<string, $wcm.ResourceType>([
		]);
		export type WasmInterface = {
			'handle': (request: i32, options_case: i32, options_option: i32, result: ptr<result<own<FutureIncomingResponse>, ErrorCode>>) => void;
		};
		export function createHost(service: http.OutgoingHandler, context: $wcm.WasmContext): WasmInterface {
			return $wcm.Host.create<WasmInterface>(functions, resources, service, context);
		}
		export function createService(wasmInterface: WasmInterface, context: $wcm.WasmContext): http.OutgoingHandler {
			return $wcm.Service.create<http.OutgoingHandler>(functions, [], wasmInterface, context);
		}
	}
}

export namespace http._ {
	export const id = 'wasi:http' as const;
	export const witName = 'http' as const;
	export const interfaces: Map<string, $wcm.InterfaceType> = new Map<string, $wcm.InterfaceType>([
		['Types', Types._],
		['IncomingHandler', IncomingHandler._],
		['OutgoingHandler', OutgoingHandler._]
	]);
	export type WasmInterface = {
		'wasi:http/types'?: Types._.WasmInterface;
		'wasi:http/incoming-handler'?: IncomingHandler._.WasmInterface;
		'wasi:http/outgoing-handler'?: OutgoingHandler._.WasmInterface;
	};
	export function createHost(service: http, context: $wcm.WasmContext): WasmInterface {
		const result: WasmInterface = Object.create(null);
		if (service.Types !== undefined) {
			result['wasi:http/types'] = Types._.createHost(service.Types, context);
		}
		if (service.IncomingHandler !== undefined) {
			result['wasi:http/incoming-handler'] = IncomingHandler._.createHost(service.IncomingHandler, context);
		}
		if (service.OutgoingHandler !== undefined) {
			result['wasi:http/outgoing-handler'] = OutgoingHandler._.createHost(service.OutgoingHandler, context);
		}
		return result;
	}
	export function createService(wasmInterface: WasmInterface, context: $wcm.WasmContext): http {
		const result: http = Object.create(null);
		if (wasmInterface['wasi:http/types'] !== undefined) {
			result.Types = Types._.createService(wasmInterface['wasi:http/types'], context);
		}
		if (wasmInterface['wasi:http/incoming-handler'] !== undefined) {
			result.IncomingHandler = IncomingHandler._.createService(wasmInterface['wasi:http/incoming-handler'], context);
		}
		if (wasmInterface['wasi:http/outgoing-handler'] !== undefined) {
			result.OutgoingHandler = OutgoingHandler._.createService(wasmInterface['wasi:http/outgoing-handler'], context);
		}
		return result;
	}
}