import type { $Fetch } from "ofetch";

import type { AuthClientOptions } from "./types";

/**
 * ThreadREST client.
 *
 */
export default class AuthClient {
  $fetch: $Fetch;

  constructor({ $fetch }: AuthClientOptions) {
    this.$fetch = $fetch;
  }
}
