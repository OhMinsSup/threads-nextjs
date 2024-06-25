import type { $Fetch } from "ofetch";

import type {
  FnNameKey,
  RpcOptions,
  UsersClientConstructorOptions,
} from "./types";
import UsersBuilder from "./users.builder";

/**
 * ThreadREST Auth client.
 *
 */
export default class UsersClient {
  protected $url: string;
  protected $fetch: $Fetch;

  constructor({ $fetch, $url }: UsersClientConstructorOptions) {
    this.$fetch = $fetch;
    this.$url = $url;
  }

  rpc<FnKey extends FnNameKey>(fnKey: FnKey, options: RpcOptions<FnKey> = {}) {
    const builder = new UsersBuilder<FnKey>({
      $fnKey: fnKey,
      $url: this.$url,
      $fetch: this.$fetch,
      $fetchOptions: options.$fetchOptions,
    });

    return builder;
  }
}
