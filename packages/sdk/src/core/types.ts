import type { $Fetch, FetchOptions } from "ofetch";

import type AuthClient from "../auth/auth.client";

// common types -----------------------------------

export type MethodType = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD";

export type JsonFetchOptions = FetchOptions<"json">;

export type $FetchOptions = Omit<JsonFetchOptions, "body" | "baseURL">;

export type $Url = string;

export type $FetchTypeNameKey = keyof Pick<$Fetch, "create" | "raw" | "native">;

// 함수 타입의 키만 추출하는 유틸리티 타입
export type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

export interface ClientOptions {
  /**
   * api prefix
   * @description API prefix.
   * @example '/api/v1'
   */
  prefix?: string;
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

export interface CoreClientBuilderConstructorOptions {
  $url: $Url;
  $fetch: $Fetch;
}

// core client types response type -----------------------------------

export interface CoreClientResponse<Data = any> {
  resultCode: number;
  message?: string | string[] | Record<string, any> | null;
  error?: string | string[] | Record<string, any> | null;
  result: Data;
}
