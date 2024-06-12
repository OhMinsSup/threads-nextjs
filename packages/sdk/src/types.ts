import type { $Fetch, FetchOptions, ResponseType } from "ofetch";

export type ApiVersionString = `v${number}`;

export interface ClientOptions<R extends ResponseType = ResponseType> {
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
  $fetchOptions?: Omit<FetchOptions<R>, "baseURL">;
  /**
   * Custom fetch function.
   * @description $fetch는 ofetch의 $Fetch와 동일합니다.
   * @default ofetch
   */
  $fetchClient?: $Fetch;
}

export interface ThreadFetchHandlerOptions<
  R extends ResponseType = ResponseType,
> {
  method: "GET" | "HEAD" | "POST" | "PATCH" | "DELETE";
  shouldThrowOnError?: boolean;
  $fetchOptions?: Omit<FetchOptions<R>, "method">;
}
