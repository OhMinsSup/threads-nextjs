import type { $Fetch, FetchOptions } from "ofetch";

import type {
  $OfetchOptions,
  ApiBuilderReturnValue,
  ApiInput,
  ConstructorOptions,
  Endpoints,
  FnNameKey,
  HeadersInit,
  MethodType,
} from "./types";
import { HttpStatus } from "../enum";
import { createError } from "../error/http";
import { schema } from "./schema";

export default class ApiBuilder<FnKey extends FnNameKey = FnNameKey> {
  protected fnKey: FnKey;

  protected url: string;

  protected fetchClient: $Fetch;

  protected shouldThrowOnError = false;

  protected method: MethodType = "GET";

  protected options?: $OfetchOptions;

  protected headers: HeadersInit;

  protected body?: ApiInput<FnKey> | undefined;

  protected signal?: AbortSignal;

  protected endpoints: Endpoints = {
    signUp: {
      pathname: "/auth/signup",
      schema: schema.signUp,
    },
    signIn: {
      pathname: "/auth/signin",
      schema: schema.signIn,
    },
    refresh: {
      pathname: "/auth/refresh",
      schema: schema.refresh,
    },
    verify: {
      pathname: "/auth/verify",
      schema: schema.verify,
    },
    me: {
      pathname: "/users",
      schema: undefined,
    },
  };

  constructor(builder: ConstructorOptions<FnKey>) {
    this.fnKey = builder.fnKey;
    if (builder.method) {
      this.method = builder.method;
    }
    this.fetchClient = builder.fetchClient;
    this.url = builder.url;
    this.options = builder.options;
    this.headers = builder.headers;
    this.body = builder.body;
    if (builder.shouldThrowOnError) {
      this.shouldThrowOnError = builder.shouldThrowOnError;
    }
    this.signal = builder.signal;
  }

  /**
   * If there's an error with the query, throwOnError will reject the promise by
   * throwing the error instead of returning it as part of a successful response.
   *
   * {@link https://github.com/supabase/supabase-js/issues/92}
   */
  throwOnError(): this {
    this.shouldThrowOnError = true;
    return this;
  }

  then<TResult1 = ApiBuilderReturnValue<FnKey>, TResult2 = never>(
    onfulfilled?:
      | ((
          value: ApiBuilderReturnValue<FnKey>,
        ) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null,
  ): PromiseLike<TResult1 | TResult2> {
    const _fetch = this.fetchClient;
    const _method = this.method;
    const _headers = this.headers;
    const _endpoint = this.endpoints[this.fnKey];
    let _body = this.body;

    // body validate
    if (!["GET", "HEAD"].includes(_method) && _body && _endpoint.schema) {
      const input = _endpoint.schema.safeParse(_body);
      if (!input.success) {
        throw createError({
          message: "Invalid input",
          status: HttpStatus.BAD_REQUEST,
          statusMessage: "Bad Request",
          data: {
            [input.error.name]: {
              message: input.error.message,
            },
          },
        });
      }
      _body = input.data as ApiInput<FnKey>;
    }

    const opts: FetchOptions<"json"> = {
      ...this.options,
      method: _method,
      headers: _headers,
      body: _body,
      signal: this.signal,
    };

    const response = _fetch<ApiBuilderReturnValue<FnKey>, "json">(
      _endpoint.pathname,
      opts,
    );

    return response.then(onfulfilled, onrejected);
  }
}
