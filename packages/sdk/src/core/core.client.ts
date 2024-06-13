import type { $Fetch } from "ofetch";
import { ofetch } from "ofetch";
import { withBase, withoutTrailingSlash } from "ufo";

import type {
  ApiVersionString,
  ClientOptions,
  CoreClientBuilderNameKey,
} from "./types";
import CoreClientBuilder from "./core.builder";

export class CoreClient {
  protected url: string;
  protected version: ApiVersionString = "v1";
  protected fetchClient: $Fetch;

  protected _client: CoreClientBuilder;

  constructor(url: string, options?: ClientOptions) {
    if (!url) {
      const error = new Error();
      error.name = "ThreadClientError";
      error.message = "ThreadClient requires a valid URL.";
      throw error;
    }

    const { $fetchOptions, apiVersion, $fetchClient } = options ?? {};

    this.url = withBase(withoutTrailingSlash(url), this.version);

    if (apiVersion) {
      this.version = apiVersion;
    }

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

  from<Bn extends CoreClientBuilderNameKey>(bn: Bn) {
    return this._client[bn];
  }

  get client() {
    return this._client;
  }
}
