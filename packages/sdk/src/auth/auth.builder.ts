import { HttpStatus } from "@thread/enum/http-status";
import { createError } from "@thread/error/http";

import type { $FetchOptions, $Url, MethodType } from "../core/types";
import type {
  AuthBuilderConstructorOptions,
  FnNameKey,
  IAuthBuilder,
} from "./types";
import { schema } from "./auth.schema";

export default class AuthBuilder<FnName extends FnNameKey>
  implements IAuthBuilder
{
  private input: AuthBuilderConstructorOptions<FnName>["input"];

  private $url: $Url;

  private $fetch: AuthBuilderConstructorOptions<FnName>["$fetch"];

  private method: MethodType;

  private $fetchOptions?: $FetchOptions;

  private _endpoints = {
    signUp: "/auth/signup",
  };

  constructor({
    $fetch,
    $url,
    input,
    method,
    $fetchOptions,
  }: AuthBuilderConstructorOptions<FnName>) {
    this.$fetch = $fetch;
    this.$url = $url;
    this.input = input;
    this.method = method;
    this.$fetchOptions = $fetchOptions;
  }

  async signUp() {
    if (this.method !== "POST") {
      throw createError({
        message: "Invalid method",
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const body = await schema.signUp.safeParseAsync(this.input);
    if (!body.success) {
      const { error } = body;
      throw createError({
        message: "Invalid input",
        status: HttpStatus.BAD_REQUEST,
        data: {
          key: error.name,
          message: error.message,
        },
      });
    }

    const response = await this.$fetch<Record<string, string>, "json">(
      this.endpoints.signUp,
      {
        ...(this.$fetchOptions ?? {}),
        method: this.method,
        body: body.data,
      },
    );

    return response;
  }

  get endpoints() {
    return this._endpoints;
  }
}
