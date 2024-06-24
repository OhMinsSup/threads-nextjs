import type { $Fetch } from "ofetch";
import { ofetch } from "ofetch";
import { withBase, withoutTrailingSlash } from "ufo";

import type { ClientOptions } from "./types";
import CoreClientBuilder from "./core.builder";

export class CoreClient {
  protected url: string;
  protected prefix = "/api/v1";
  protected fetchClient: $Fetch;

  protected _client: CoreClientBuilder;

  constructor(url: string, options?: ClientOptions) {
    if (!url) {
      const error = new Error();
      error.name = "ThreadClientError";
      error.message = "ThreadClient requires a valid URL.";
      throw error;
    }

    const { $fetchOptions, prefix, $fetchClient } = options ?? {};

    if (prefix) {
      this.prefix = prefix;
    }

    this.url = withBase(this.prefix, withoutTrailingSlash(url));

    console.log("this.url", this.url);

    if ($fetchClient) {
      this.fetchClient = $fetchClient.create({
        ...$fetchOptions,
        baseURL: url,
      });
    } else {
      this.fetchClient = ofetch.create({
        ...$fetchOptions,
        baseURL: url,
      });
    }

    this._client = new CoreClientBuilder({
      $url: url,
      $fetch: this.fetchClient,
    });
  }

  get auth() {
    return this._client.auth;
  }

  get users() {
    return this._client.users;
  }
}
