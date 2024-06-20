import type { FetchOptions } from "ofetch";

import type {
  $FetchOptions,
  CoreClientBuilderConstructorOptions,
  MethodType,
} from "../core/types";

// users.client.ts -----------------------------------

export type UsersClientConstructorOptions = CoreClientBuilderConstructorOptions;

export type FnNameKey = "getMe";

// users.builder.ts -----------------------------------

export type UsersBuilderInput<Fn extends FnNameKey> = Fn extends "getMe"
  ? undefined
  : FetchOptions["body"];

export type UsersBuilderConstructorOptions<FnKey extends FnNameKey> =
  UsersClientConstructorOptions & {
    /**
     * Function key.
     * @description fnKey는 함수 이름을 나타냅니다. (rpc 함수 이름)
     */
    $fnKey: FnKey;
    /**
     * http method.
     * @description method은 HTTP method를 나타냅니다.
     * @example 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'
     */
    method: MethodType;
    /**
     * Fetch options.
     * @description $fetchOptions는 ofetch의 FetchOptions와 동일합니다.
     */
    $fetchOptions?: $FetchOptions;
  };

export type RpcOptions<FnKey extends FnNameKey> = Partial<
  Pick<UsersBuilderConstructorOptions<FnKey>, "method" | "$fetchOptions">
>;

// users response types -----------------------------------
