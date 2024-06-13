import type { $Fetch, FetchOptions } from "ofetch";

import type AuthClient from "../auth/auth.client";

// common types -----------------------------------

export type ApiVersionString = `v${number}`;

export type MethodType = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD";

export type JsonFetchOptions = FetchOptions<"json">;

export type $FetchOptions = Omit<JsonFetchOptions, "body" | "baseURL">;

export type $Url = string;

export interface ClientOptions {
  /**
   * API version.
   * @description apiVersionName은 'v' + 숫자 형태로 되어야 합니다.
   * @example 'v1', 'v2'
   */
  apiVersion?: ApiVersionString;
  /**
   * Fetch options.
   * @description $fetchOptions는 ofetch의 FetchOptions와 동일합니다.
   */
  $fetchOptions?: $FetchOptions;
  /**
   * Custom fetch function.
   * @description $fetch는 ofetch의 $Fetch와 동일합니다.
   * @default ofetch
   */
  $fetchClient?: $Fetch;
}

// core client builder types -----------------------------------

export interface ICoreClientBuilder {
  auth: AuthClient;
}

export type CoreClientBuilderNameKey = keyof ICoreClientBuilder;

export interface CoreClientBuilderConstructorOptions {
  $url: $Url;
  $fetch: $Fetch;
}
