import type { $Fetch } from "ofetch";
import { FetchError } from "ofetch";
import { joinURL } from "ufo";

import type { $FetchOptions, $Url, CoreClientResponse } from "../core/types";
import type {
  FnNameKey,
  GetMeResponse,
  UsersBuilderConstructorOptions,
  UsersBuilderInput,
} from "./types";
import { HttpStatus } from "../constants/http-status";
import { createError } from "../error/http";

export default class UsersBuilder<FnKey extends FnNameKey = FnNameKey> {
  private $fnKey: FnKey;

  private $url: $Url;

  private $fetch: $Fetch;

  private $fetchOptions?: $FetchOptions;

  private _endpoints = {
    root: "/users",
  };

  constructor({
    $fnKey,
    $fetch,
    $url,
    $fetchOptions,
  }: UsersBuilderConstructorOptions<FnKey>) {
    this.$fnKey = $fnKey;
    this.$fetch = $fetch;
    this.$url = $url;
    this.$fetchOptions = $fetchOptions;
  }

  async call(input?: UsersBuilderInput<FnKey>) {
    const key = this.$fnKey;
    const isFnExist = key in this;
    if (!isFnExist) {
      throw createError({
        message: "Invalid function",
        status: HttpStatus.NOT_FOUND,
        statusMessage: "Not Found",
      });
    }

    return await this.getMe();
  }

  /**
   * @public
   * @description 회원가입
   */
  protected async getMe() {
    try {
      const requestUrl = joinURL(this.$url, this._endpoints.root);

      return await this.$fetch<CoreClientResponse<GetMeResponse>, "json">(
        requestUrl,
        {
          ...(this.$fetchOptions ?? {}),
          method: "GET",
        },
      );
    } catch (error) {
      if (error instanceof FetchError) {
        throw createError(error);
      }
      throw error;
    }
  }
}
