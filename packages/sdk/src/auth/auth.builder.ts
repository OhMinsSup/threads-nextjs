import type { $Fetch } from "ofetch";
import { joinURL } from "ufo";

import { HttpStatus } from "@thread/enum/http-status";
import { createError } from "@thread/error/http";

import type { $FetchOptions, $Url } from "../core/types";
import type {
  FormFieldRefreshTokenSchema,
  FormFieldSignInSchema,
  FormFieldSignUpSchema,
  FormFieldVerifyTokenSchema,
} from "./auth.schema";
import type {
  AuthBuilderConstructorOptions,
  AuthBuilderInput,
  AuthBuilderReturnValue,
  FnNameKey,
} from "./types";
import { schema } from "./auth.schema";

export default class AuthBuilder<FnKey extends FnNameKey = FnNameKey> {
  private $fnKey: FnKey;

  private $url: $Url;

  private $fetch: $Fetch;

  private $fetchOptions?: $FetchOptions;

  private _endpoints = {
    signUp: "/auth/signup",
    signIn: "/auth/signin",
    refresh: "/auth/refresh",
    verify: "/auth/verify",
  };

  constructor({
    $fnKey,
    $fetch,
    $url,
    $fetchOptions,
  }: AuthBuilderConstructorOptions<FnKey>) {
    this.$fnKey = $fnKey;
    this.$fetch = $fetch;
    this.$url = $url;
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
   * @description 리프레시 토큰을 이용하여 새로운 토큰을 발급합니다.
   * @param {FormFieldRefreshTokenSchema} input
   */
  protected async refresh(
    input: FnKey extends "refresh" ? FormFieldRefreshTokenSchema : never,
  ): Promise<AuthBuilderReturnValue<FnKey>> {
    const requestUrl = joinURL(this.$url, this._endpoints.refresh);

    const body = await schema.refresh.safeParseAsync(input);
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

    return await this.$fetch<AuthBuilderReturnValue<FnKey>, "json">(
      requestUrl,
      {
        ...(this.$fetchOptions ?? {}),
        method: "PATCH",
        body: body.data,
      },
    );
  }

  /**
   * @description 회원가입
   * @param {FormFieldSignUpSchema} input
   */
  protected async signUp(
    input: FnKey extends "signUp" ? FormFieldSignUpSchema : never,
  ): Promise<AuthBuilderReturnValue<FnKey>> {
    const requestUrl = joinURL(this.$url, this._endpoints.signUp);

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

    return await this.$fetch<AuthBuilderReturnValue<FnKey>, "json">(
      requestUrl,
      {
        ...(this.$fetchOptions ?? {}),
        method: "POST",
        body: body.data,
      },
    );
  }

  /**
   * @description 로그인
   * @param {FormFieldSignInSchema} input
   */
  protected async signIn(
    input: FnKey extends "signIn" ? FormFieldSignInSchema : never,
  ): Promise<AuthBuilderReturnValue<FnKey>> {
    const requestUrl = joinURL(this.$url, this._endpoints.signIn);

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

    return await this.$fetch<AuthBuilderReturnValue<FnKey>, "json">(
      requestUrl,
      {
        ...(this.$fetchOptions ?? {}),
        method: "POST",
        body: body.data,
      },
    );
  }

  protected async verify(
    input: FnKey extends "verify" ? FormFieldVerifyTokenSchema : never,
  ): Promise<AuthBuilderReturnValue<FnKey>> {
    const requestUrl = joinURL(this.$url, this._endpoints.verify);

    const body = await schema.verify.safeParseAsync(input);
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

    return await this.$fetch<AuthBuilderReturnValue<FnKey>, "json">(
      requestUrl,
      {
        ...(this.$fetchOptions ?? {}),
        method: "POST",
        body: body.data,
      },
    );
  }
}
