import type { $Fetch } from "ofetch";
import { ofetch } from "ofetch";
import { withBase, withoutTrailingSlash } from "ufo";

import type { FnNameKey, Options, RpcOptions } from "./types";
import { ApiFilterBuilder } from "./api.filter.builder";

export class ApiClient {
  protected url: string;
  protected prefix = "/api/v1";
  protected fetchClient: $Fetch;

  constructor(url: string, otps?: Options) {
    if (!url) {
      const error = new Error();
      error.name = "ThreadClientError";
      error.message = "ThreadClient requires a valid URL.";
      throw error;
    }

    const { options, prefix, fetchClient } = otps ?? {};

    if (prefix) {
      this.prefix = prefix;
    }

    this.url = withBase(this.prefix, withoutTrailingSlash(url));

    if (fetchClient) {
      this.fetchClient = fetchClient.create({
        ...options,
        baseURL: this.url,
      });
    } else {
      this.fetchClient = ofetch.create({
        ...options,
        baseURL: this.url,
      });
    }
  }

  rpc<FnKey extends FnNameKey>(fnKey: FnKey, options: RpcOptions = {}) {
    return new ApiFilterBuilder<FnKey>({
      fnKey,
      fetchClient: this.fetchClient,
      url: this.url,
      headers: options.headers,
      method: options.method,
    });
  }

  get fetch() {
    return this.fetchClient;
  }
}
