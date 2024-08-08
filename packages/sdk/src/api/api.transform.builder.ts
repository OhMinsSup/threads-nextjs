import type { $Fetch } from "ofetch";

import type {
  $OfetchOptions,
  ApiInput,
  FnNameKey,
  HeadersInit,
  MethodType,
  TransformBuilderConstructorOptions,
} from "./types";
import ApiBuilder from "./api.builder";

export class ApiTransformBuilder<FnKey extends FnNameKey = FnNameKey> {
  protected fnKey: FnKey;

  protected url: string;

  protected fetchClient: $Fetch;

  protected shouldThrowOnError = false;

  protected options?: $OfetchOptions;

  protected headers: HeadersInit;

  protected path?: Record<string, string>;

  protected signal?: AbortSignal;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected searchParams?: Record<string, any>;

  constructor(transform: TransformBuilderConstructorOptions<FnKey>) {
    this.fnKey = transform.fnKey;
    this.url = transform.url;
    this.fetchClient = transform.fetchClient;
    if (transform.signal) {
      this.signal = transform.signal;
    }
    if (transform.options) {
      this.options = transform.options;
    }
    if (transform.headers) {
      this.headers = transform.headers;
    }
    if (transform.path) {
      this.path = transform.path;
    }
  }

  /**
   * @description Set the authorization token.
   * @param {string} token
   * @param {"Bearer" | "Basic"} type
   */
  setAuthToken(token: string, type: "Bearer" | "Basic" = "Bearer") {
    const _cloneHeaders = new Headers(this.headers);
    _cloneHeaders.set("Authorization", `${type} ${token}`);
    this.headers = _cloneHeaders;
    return this;
  }
  /**
   * @description Set the headers.
   * @param {HeadersInit} headers
   * @param {"set" | "append" | "delete"} type
   */
  setHeaders(
    headers: HeadersInit | Record<string, unknown>,
    type: "set" | "append" | "delete" = "set",
  ) {
    const _cloneHeaders = new Headers(this.headers);
    if (headers instanceof Headers) {
      for (const [key, value] of Object.entries(headers)) {
        if (typeof value === "string") {
          _cloneHeaders[type](key, value);
        }
        if (Array.isArray(value)) {
          _cloneHeaders[type](key, value.join(","));
        }
      }
    } else if (Array.isArray(headers)) {
      for (const header of headers) {
        if (Array.isArray(header) && header.length === 2) {
          const [key, value] = header;
          if (key && value) {
            _cloneHeaders[type](key, value);
          }
        }
      }
    } else if (typeof headers === "object") {
      for (const [key, value] of Object.entries(headers)) {
        if (typeof value === "string") {
          _cloneHeaders[type](key, value);
        }
        if (Array.isArray(value)) {
          _cloneHeaders[type](key, value.join(","));
        }
      }
    }

    this.headers = _cloneHeaders;
    return this;
  }

  /**
   * Post method.
   *
   * @param {ApiInput<FnKey>?} body
   */
  post<MethodKey extends MethodType = "POST">(
    body?: ApiInput<FnKey, MethodKey>,
  ) {
    return new ApiBuilder<FnKey, MethodKey>({
      fnKey: this.fnKey,
      url: this.url,
      fetchClient: this.fetchClient,
      headers: this.headers,
      method: "POST" as MethodKey,
      options: this.options,
      body,
      signal: this.signal,
      path: this.path,
      shouldThrowOnError: this.shouldThrowOnError,
      searchParams: this.searchParams,
    });
  }

  /**
   * Get method.
   */
  get<MethodKey extends MethodType = "GET">() {
    return new ApiBuilder<FnKey, MethodKey>({
      fnKey: this.fnKey,
      url: this.url,
      fetchClient: this.fetchClient,
      headers: this.headers,
      method: "GET" as MethodKey,
      options: this.options,
      signal: this.signal,
      path: this.path,
      shouldThrowOnError: this.shouldThrowOnError,
      searchParams: this.searchParams,
    });
  }

  /**
   * Put method.
   *
   * @param {ApiInput<FnKey>?} body
   */
  put<MethodKey extends MethodType = "PUT">(body?: ApiInput<FnKey, MethodKey>) {
    return new ApiBuilder<FnKey, MethodKey>({
      fnKey: this.fnKey,
      url: this.url,
      fetchClient: this.fetchClient,
      headers: this.headers,
      method: "PUT" as MethodKey,
      options: this.options,
      body,
      signal: this.signal,
      path: this.path,
      shouldThrowOnError: this.shouldThrowOnError,
      searchParams: this.searchParams,
    });
  }

  /**
   * Delete method.
   */
  delete<MethodKey extends MethodType = "DELETE">() {
    return new ApiBuilder<FnKey, MethodKey>({
      fnKey: this.fnKey,
      url: this.url,
      fetchClient: this.fetchClient,
      headers: this.headers,
      method: "DELETE" as MethodKey,
      options: this.options,
      signal: this.signal,
      path: this.path,
      shouldThrowOnError: this.shouldThrowOnError,
      searchParams: this.searchParams,
    });
  }

  /**
   * Patch method.
   *
   * @param {ApiInput<FnKey>?} body
   */
  patch<MethodKey extends MethodType = "PATCH">(
    body?: ApiInput<FnKey, MethodKey>,
  ) {
    return new ApiBuilder<FnKey, MethodKey>({
      fnKey: this.fnKey,
      url: this.url,
      fetchClient: this.fetchClient,
      headers: this.headers,
      method: "PATCH" as MethodKey,
      options: this.options,
      body,
      signal: this.signal,
      path: this.path,
      shouldThrowOnError: this.shouldThrowOnError,
      searchParams: this.searchParams,
    });
  }

  /**
   * Set the AbortSignal for the fetch request.
   *
   * @param signal - The AbortSignal to use for the fetch request
   */
  abortSignal(signal: AbortSignal): this {
    this.signal = signal;
    return this;
  }

  /**
   * Set the pathObject for the fetch request.
   *
   * @param {Record<string, string>?} params
   */
  setPath(params?: Record<string, string>) {
    this.path = params;
    return this;
  }

  /**
   *
   * Set the searchParams for the fetch request.
   *
   * @param {Record<string, unknown>?} params
   */
  setSearchParams(params?: Record<string, unknown>) {
    this.searchParams = params;
    return this;
  }

  /**
   * If there's an error with the query, throwOnError will reject the promise by
   * throwing the error instead of returning it as part of a successful response.
   *
   * {@link https://github.com/supabase/supabase-js/issues/92}
   */
  throwOnError(): this {
    this.shouldThrowOnError = true;
    return this;
  }
}
