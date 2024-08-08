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
  signal?: AbortSignal;
  path?: Record<string, string>;
  options?: $OfetchOptions;
}

// api.filter.ts -----------------------------------

// api.transform.builder.ts -----------------------------------
export type ApiInput<
  FnKey extends FnNameKey,
  MethodKey extends MethodType,
> = FnKey extends "signUp"
  ? MethodKey extends "POST"
    ? FormFieldSignUpSchema
    : undefined
  : FnKey extends "signIn"
    ? MethodKey extends "POST"
      ? FormFieldSignInSchema
      : undefined
    : FnKey extends "refresh"
      ? MethodKey extends "PATCH"
        ? FormFieldRefreshTokenSchema
        : undefined
      : FnKey extends "verify"
        ? MethodKey extends "POST"
          ? FormFieldVerifyTokenSchema
          : undefined
        : undefined;

export interface TransformBuilderConstructorOptions<FnKey extends FnNameKey> {
  fnKey: FnKey;
  url: string;
  fetchClient: $Fetch;
  options?: $OfetchOptions;
  headers?: HeadersInit;
  signal?: AbortSignal;
  path?: Record<string, string>;
}

// api.builder.ts -----------------------------------
export interface BuilderConstructorOptions<
  FnKey extends FnNameKey,
  MethodKey extends MethodType,
> {
  fnKey: FnKey;
  url: string;
  fetchClient: $Fetch;
  shouldThrowOnError?: boolean;
  method: MethodKey;
  options?: $OfetchOptions;
  headers?: HeadersInit;
  body?: ApiInput<FnKey, MethodKey>;
  signal?: AbortSignal;
  path?: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchParams?: Record<string, any>;
}

// response types -----------------------------------

interface TokenItemSchema {
  token: string;
  expiresAt: Date | number | string;
}

export interface TokenResponse {
  accessToken: TokenItemSchema;
  refreshToken: TokenItemSchema;
}

export interface AuthResponse
  extends Pick<UserExternalPayload, "email" | "id" | "name" | "image"> {
  tokens: TokenResponse;
}

export type UserResponse = UserExternalPayload;

// api.builder.ts -----------------------------------

type ApiResponse<FnKey, MethodKey> = FnKey extends "signUp"
  ? MethodKey extends "POST"
    ? AuthResponse
    : never
  : FnKey extends "signIn"
    ? MethodKey extends "POST"
      ? AuthResponse
      : never
    : FnKey extends "refresh"
      ? MethodKey extends "PATCH"
        ? AuthResponse
        : never
      : FnKey extends "verify"
        ? MethodKey extends "POST"
          ? boolean
          : never
        : FnKey extends "me"
          ? MethodKey extends "GET"
            ? UserResponse
            : never
          : FnKey extends "byUserId"
            ? MethodKey extends "GET"
              ? UserResponse
              : never
            : never;

export type ApiBuilderReturnValue<
  FnKey extends FnNameKey,
  MethodKey extends MethodType,
> = ClientResponse<ApiResponse<FnKey, MethodKey>>;
