import type { FetchOptions } from "ofetch";

import type {
  $FetchOptions,
  CoreClientBuilderConstructorOptions,
  MethodType,
} from "../core/types";
import type {
  FormFieldRefreshTokenSchema,
  FormFieldSignInSchema,
  FormFieldSignUpSchema,
} from "./auth.schema";

// auth.client.ts -----------------------------------

export type AuthClientConstructorOptions = CoreClientBuilderConstructorOptions;

export type FnNameKey = "signUp" | "signIn" | "refresh";

// auth.builder.ts -----------------------------------

export type AuthBuilderInput<Fn extends FnNameKey> = Fn extends "signUp"
  ? FormFieldSignUpSchema
  : Fn extends "signIn"
    ? FormFieldSignInSchema
    : Fn extends "refresh"
      ? FormFieldRefreshTokenSchema
      : FetchOptions["body"];

export type AuthBuilderConstructorOptions<FnKey extends FnNameKey> =
  AuthClientConstructorOptions & {
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
  Pick<AuthBuilderConstructorOptions<FnKey>, "method" | "$fetchOptions">
>;

// auth response types -----------------------------------

interface TokenItemSchema {
  token: string;
  expiresAt: Date;
}

interface TokenSchema {
  accessToken: TokenItemSchema;
  refreshToken: TokenItemSchema;
}

export interface AuthSchema extends TokenSchema {
  userId: string;
}
