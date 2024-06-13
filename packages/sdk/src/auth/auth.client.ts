import type { $Fetch } from "ofetch";

import type {
  AuthBuilderConstructorOptions,
  AuthClientConstructorOptions,
  FnNameKey,
} from "./types";
import AuthBuilder from "./auth.builder";

/**
 * ThreadREST client.
 *
 */
export default class AuthClient {
  protected $url: string;
  protected $fetch: $Fetch;

  constructor({ $fetch, $url }: AuthClientConstructorOptions) {
    this.$fetch = $fetch;
    this.$url = $url;
  }

  rpc<Fn extends FnNameKey>(
    fn: Fn,
    options: AuthBuilderConstructorOptions<Fn>,
  ) {
    return new AuthBuilder<Fn>({
      $url: this.$url,
      $fetch: this.$fetch,
      input: options.input,
      method: options.method,
      $fetchOptions: options.$fetchOptions,
    })[fn];
  }

  signUp(options: AuthBuilderConstructorOptions<"signUp">) {
    return this.rpc("signUp", options);
  }
}
