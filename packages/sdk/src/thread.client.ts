import type { $Fetch, ResponseType } from "ofetch";
import { ofetch } from "ofetch";
import { withBase, withoutTrailingSlash } from "ufo";

import type { ApiVersionString, ClientOptions } from "./types";
import AuthClient from "./auth/auth.client";

export class ThreadClient<R extends ResponseType = ResponseType> {
  protected url: string;
  protected version: ApiVersionString = "v1";
  protected fetchClient: $Fetch;

  auth: AuthClient;

  constructor(
    url: string,
    { $fetchOptions, apiVersion, $fetchClient }: ClientOptions<R>,
  ) {
    if (!url) {
      const error = new Error();
      error.name = "ThreadClientError";
      error.message = "ThreadClient requires a valid URL.";
      throw error;
    }

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

    this.auth = new AuthClient({ $fetch: this.fetchClient });
  }
}
