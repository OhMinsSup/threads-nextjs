import type { $Fetch, FetchOptions } from "ofetch";

import type { UserExternalPayload } from "@thread/db/selectors";

import type {
  FormFieldRefreshTokenSchema,
  FormFieldSignInSchema,
  FormFieldSignUpSchema,
  FormFieldVerifyTokenSchema,
  Schema,
} from "./schema";

// common types -----------------------------------
export type $OfetchOptions = Omit<
  FetchOptions<"json">,
  "body" | "baseURL" | "headers" | "signal" | "params"
>;

export type HeadersInit = FetchOptions<"json">["headers"];
export type MethodType = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD";

export interface ClientResponse<Data = unknown> {
  resultCode: number;
  message?: string | string[] | Record<string, unknown> | null;
  error?: string | string[] | Record<string, unknown> | null;
  result: Data;
}

export interface Endpoint {
  pathname: string | ((...args: any[]) => string);
  schema:
    | Schema["signUp"]
    | Schema["signIn"]
    | Schema["refresh"]
    | Schema["verify"]
    | undefined;
}

export interface Endpoints {
  signUp: Endpoint;
  signIn: Endpoint;
  refresh: Endpoint;
  verify: Endpoint;
  me: Endpoint;
  byUserId: Endpoint;
}

export type EndpointsKey = keyof Endpoints;

// api.client.ts -----------------------------------

export interface Options {
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
  options?: $OfetchOptions;
  /**
   * Custom fetch function.
   * @description $fetch는 ofetch의 $Fetch와 동일합니다.
   * @default ofetch
   */
  fetchClient?: $Fetch;
}

export type FnNameKey = EndpointsKey;

export interface RpcOptions {
  headers?: HeadersInit;
  method?: MethodType;
}

// api.filter.ts -----------------------------------

// api.transform.builder.ts -----------------------------------

export type ApiInput<Fn extends FnNameKey> = Fn extends "signUp"
  ? FormFieldSignUpSchema
  : Fn extends "signIn"
    ? FormFieldSignInSchema
    : Fn extends "refresh"
      ? FormFieldRefreshTokenSchema
      : Fn extends "verify"
        ? FormFieldVerifyTokenSchema
        : undefined;

// api.builder.ts -----------------------------------
export interface ConstructorOptions<FnKey extends FnNameKey> {
  fnKey: FnKey;
  url: string;
  fetchClient: $Fetch;
  shouldThrowOnError?: boolean;
  method?: MethodType;
  options?: $OfetchOptions;
  headers?: HeadersInit;
}

// response types -----------------------------------

interface TokenItemSchema {
  token: string;
  expiresAt: Date;
}

export interface TokenResponse {
  accessToken: TokenItemSchema;
  refreshToken: TokenItemSchema;
}

export interface AuthResponse
  extends Pick<UserExternalPayload, "email" | "id" | "name" | "image"> {
  tokens: TokenResponse;
}

// api.builder.ts -----------------------------------

export type ApiBuilderReturnValue<Fn extends FnNameKey> = ClientResponse<
  Fn extends "signUp"
    ? AuthResponse
    : Fn extends "signIn"
      ? AuthResponse
      : Fn extends "refresh"
        ? AuthResponse
        : Fn extends "verify"
          ? boolean
          : unknown
>;
