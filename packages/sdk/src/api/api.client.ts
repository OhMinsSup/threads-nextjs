import type { $Fetch, FetchOptions } from "ofetch";
import { ofetch } from "ofetch";
import { withBase, withoutTrailingSlash } from "ufo";

import type { FnNameKey, Options, RpcOptions } from "./types";
import { ApiTransformBuilder } from "./api.transform.builder";

export class ApiClient {
  protected url: string;
  protected prefix = "/api/v1";
  protected fetchClient: $Fetch;

  constructor(url: string, otps?: Options) {
    if (!url) {
      const error = new Error();
      error.name = "ThreadClientError";
      error.message = "ThreadClient requires a valid URL.";
      throw error;
    }

    const { options, prefix, fetchClient } = otps ?? {};

    if (prefix) {
      this.prefix = prefix;
    }

    this.url = withBase(this.prefix, withoutTrailingSlash(url));

    if (fetchClient) {
      this.fetchClient = fetchClient.create({
        ...options,
        baseURL: this.url,
      });
    } else {
      this.fetchClient = ofetch.create({
        ...options,
        baseURL: this.url,
      });
    }
  }

  rpc<FnKey extends FnNameKey>(fnKey: FnKey, options: RpcOptions = {}) {
    return new ApiTransformBuilder<FnKey>({
      fnKey,
      fetchClient: this.fetchClient,
      url: this.url,
      options: options.options,
      headers: options.headers,
      signal: options.signal,
      path: options.path,
    });
  }

  fetchNative(input: string | URL | globalThis.Request, init?: RequestInit) {
    return this.fetchClient.native(input, init);
  }

  fetchRaw<
    T = any,
    R extends "json" | "text" | "blob" | "arrayBuffer" | "stream" = "json",
  >(request: string | Request, options?: FetchOptions<R> | undefined) {
    return this.fetchClient.raw<T, R>(request, options);
  }

  fetch<
    T = any,
    R extends "json" | "text" | "blob" | "arrayBuffer" | "stream" = "json",
  >(request: string | Request, options?: FetchOptions<R> | undefined) {
    return this.fetchClient<T, R>(request, options);
  }
}
