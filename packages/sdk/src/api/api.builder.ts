import type { $Fetch, FetchOptions } from "ofetch";

import type {
  $OfetchOptions,
  ApiBuilderReturnValue,
  ApiInput,
  BuilderConstructorOptions,
  Endpoints,
  FnNameKey,
  HeadersInit,
  MethodType,
} from "./types";
import { HttpStatus } from "../enum";
import { createHttpError } from "../error";
import { schema } from "./schema";

export default class ApiBuilder<
  FnKey extends FnNameKey = FnNameKey,
  MethodKey extends MethodType = MethodType,
> {
  protected fnKey: FnKey;

  protected url: string;

  protected fetchClient: $Fetch;

  protected shouldThrowOnError = false;

  protected method: MethodKey;

  protected options?: $OfetchOptions;

  protected headers: HeadersInit;

  protected body?: ApiInput<FnKey, MethodKey> | undefined;

  protected signal?: AbortSignal;

  protected path?: Record<string, string>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected searchParams?: Record<string, any>;

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
    byUserId: {
      pathname: (id: string) => `/users/${id}`,
      schema: undefined,
    },
  };

  constructor(builder: BuilderConstructorOptions<FnKey, MethodKey>) {
    this.fnKey = builder.fnKey;
    this.url = builder.url;
    this.fetchClient = builder.fetchClient;
    this.headers = builder.headers;
    this.method = builder.method;
    this.options = builder.options;
    this.body = builder.body;
    this.signal = builder.signal;
    this.searchParams = builder.searchParams;
    this.path = builder.path;
    if (builder.shouldThrowOnError) {
      this.shouldThrowOnError = builder.shouldThrowOnError;
    }
  }

  then<TResult1 = ApiBuilderReturnValue<FnKey, MethodKey>, TResult2 = never>(
    onfulfilled?:
      | ((
          value: ApiBuilderReturnValue<FnKey, MethodKey>,
        ) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null,
  ): PromiseLike<TResult1 | TResult2> {
    const _endpoint = this.endpoints[this.fnKey];
    const _path = this.path;

    let _body = this.body;

    // body validate
    if (!["GET", "HEAD"].includes(this.method) && _body && _endpoint.schema) {
      const input = _endpoint.schema.safeParse(_body);
      if (!input.success) {
        throw createHttpError({
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
      _body = input.data as ApiInput<FnKey, MethodKey>;
    }

    let pathname: string | null = null;
    if (typeof _endpoint.pathname === "function" && _path) {
      pathname = _endpoint.pathname(...Object.values(_path));
    } else if (typeof _endpoint.pathname === "string" && _path) {
      // ex) /users/:id -> /users/1, /users/:id/:name -> /users/1/john
      pathname = Object.entries(_path).reduce(
        (acc, [key, value]) => acc.replace(new RegExp(`:${key}`, "g"), value),
        _endpoint.pathname,
      );
    } else if (typeof _endpoint.pathname === "string") {
      pathname = _endpoint.pathname;
    }

    if (!pathname) {
      throw createHttpError({
        message: "Invalid pathname",
        status: HttpStatus.NOT_FOUND,
        statusMessage: "Not Found",
      });
    }

    const opts: FetchOptions<"json"> = {
      ...this.options,
      method: this.method,
      headers: this.headers,
      signal: this.signal,
      params: this.searchParams,
      body: _body,
    };

    const response = this.fetchClient<
      ApiBuilderReturnValue<FnKey, MethodKey>,
      "json"
    >(pathname, opts);

    return response.then(onfulfilled, onrejected).catch(onrejected);
  }
}
