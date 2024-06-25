import type { $Fetch } from "ofetch";

import type {
  AuthClientConstructorOptions,
  FnNameKey,
  RpcOptions,
} from "./types";
import AuthBuilder from "./auth.builder";

/**
 * ThreadREST Auth client.
 *
 */
export default class AuthClient {
  protected $url: string;
  protected $fetch: $Fetch;

  constructor({ $fetch, $url }: AuthClientConstructorOptions) {
    this.$fetch = $fetch;
    this.$url = $url;
  }

  rpc<FnKey extends FnNameKey>(fnKey: FnKey, options: RpcOptions<FnKey> = {}) {
    const builder = new AuthBuilder<FnKey>({
      $fnKey: fnKey,
      $url: this.$url,
      $fetch: this.$fetch,
      $fetchOptions: options.$fetchOptions,
    });

    return builder;
  }
}
