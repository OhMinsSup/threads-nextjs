import type { $Fetch } from "ofetch";

import { HttpStatus } from "@thread/enum/http-status";
import { createError } from "@thread/error/http";

import type {
  $FetchOptions,
  $Url,
  CoreClientResponse,
  MethodType,
} from "../core/types";
import type {
  FnNameKey,
  GetMeResponse,
  UsersBuilderConstructorOptions,
  UsersBuilderInput,
} from "./types";

export default class UsersBuilder<FnKey extends FnNameKey = FnNameKey> {
  private $fnKey: FnKey;

  private $url: $Url;

  private $fetch: $Fetch;

  private method: MethodType;

  private $fetchOptions?: $FetchOptions;

  private _endpoints = {
    root: "/users",
  };

  constructor({
    $fnKey,
    $fetch,
    $url,
    method,
    $fetchOptions,
  }: UsersBuilderConstructorOptions<FnKey>) {
    this.$fnKey = $fnKey;
    this.$fetch = $fetch;
    this.$url = $url;
    this.method = method;
    this.$fetchOptions = $fetchOptions;
  }

  async call(input?: UsersBuilderInput<FnKey>) {
    const key = this.$fnKey;
    const isFnExist = key in this;
    if (!isFnExist) {
      throw createError({
        message: "Invalid function",
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return await this.getMe();
  }

  /**
   * @public
   * @description 회원가입
   */
  protected async getMe() {
    if (this.method !== "GET") {
      throw createError({
        message: "Invalid method",
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return await this.$fetch<CoreClientResponse<GetMeResponse>, "json">(
      this._endpoints.root,
      {
        ...(this.$fetchOptions ?? {}),
        method: this.method,
      },
    );
  }
}
