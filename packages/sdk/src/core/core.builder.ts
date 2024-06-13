import type {
  CoreClientBuilderConstructorOptions,
  ICoreClientBuilder,
} from "./types";
import AuthClient from "../auth/auth.client";

export default class CoreClientBuilder implements ICoreClientBuilder {
  protected _auth: AuthClient;

  constructor({ $url, $fetch }: CoreClientBuilderConstructorOptions) {
    this._auth = new AuthClient({ $url, $fetch });
  }

  get auth() {
    return this._auth;
  }
}
