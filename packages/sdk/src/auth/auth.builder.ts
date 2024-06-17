import type { $Fetch } from "ofetch";

import { HttpStatus } from "@thread/enum/http-status";
import { createError } from "@thread/error/http";

import type { $FetchOptions, $Url, MethodType } from "../core/types";
import type {
  FormFieldSignInSchema,
  FormFieldSignUpSchema,
} from "./auth.schema";
import type {
  AuthBuilderConstructorOptions,
  AuthBuilderInput,
  FnNameKey,
} from "./types";
import { schema } from "./auth.schema";

export default class AuthBuilder<FnKey extends FnNameKey = FnNameKey> {
  private $fnKey: FnKey;

  private $url: $Url;

  private $fetch: $Fetch;

  private method: MethodType;

  private $fetchOptions?: $FetchOptions;

  private _endpoints = {
    signUp: "/auth/signup",
    signIn: "/auth/signin",
  };

  constructor({
    $fnKey,
    $fetch,
    $url,
    method,
    $fetchOptions,
  }: AuthBuilderConstructorOptions<FnKey>) {
    this.$fnKey = $fnKey;
    this.$fetch = $fetch;
    this.$url = $url;
    this.method = method;
    this.$fetchOptions = $fetchOptions;
  }

  async call(input: AuthBuilderInput<FnKey>) {
    const key = this.$fnKey;
    const isFnExist = key in this;
    if (!isFnExist) {
      throw createError({
        message: "Invalid function",
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return await this[key](input as never);
  }

  /**
   * @public
   * @description 회원가입
   */
  protected async signUp(
    input: FnKey extends "signUp" ? FormFieldSignUpSchema : never,
  ) {
    if (this.method !== "POST") {
      throw createError({
        message: "Invalid method",
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const body = await schema.signUp.safeParseAsync(input);
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

    return await this.$fetch<Record<string, string>, "json">(
      this._endpoints.signUp,
      {
        ...(this.$fetchOptions ?? {}),
        method: this.method,
        body: body.data,
      },
    );
  }

  /**
   * @public
   * @description 로그인
   */
  protected async signIn(
    input: FnKey extends "signIn" ? FormFieldSignInSchema : never,
  ) {
    if (this.method !== "POST") {
      throw createError({
        message: "Invalid method",
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const body = await schema.signIn.safeParseAsync(input);
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

    return await this.$fetch<Record<string, string>, "json">(
      this._endpoints.signIn,
      {
        ...(this.$fetchOptions ?? {}),
        method: this.method,
        body: body.data,
      },
    );
  }
}
