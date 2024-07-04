import type { FnNameKey, HeadersInit } from "./types";
import { ApiTransformBuilder } from "./api.transform.builder";

export class ApiFilterBuilder<
  FnKey extends FnNameKey = FnNameKey,
> extends ApiTransformBuilder<FnKey> {
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
}
