import type { FetchOptions } from "ofetch";

import type {
  $FetchOptions,
  CoreClientBuilderConstructorOptions,
  MethodType,
} from "../core/types";
import type { FormFieldSignUpSchema } from "./auth.schema";

// auth.client.ts -----------------------------------

export type AuthClientConstructorOptions = CoreClientBuilderConstructorOptions;

export interface IAuthBuilder {
  signUp: () => Promise<Record<string, string>>;
}

export type FnNameKey = keyof IAuthBuilder;

// auth.builder.ts -----------------------------------

export type AuthBuilderConstructorOptions<FnName extends FnNameKey> =
  AuthClientConstructorOptions & {
    input: FnName extends "signUp"
      ? FormFieldSignUpSchema
      : FetchOptions["body"];
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
