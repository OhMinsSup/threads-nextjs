import type {
  CoreClientBuilderConstructorOptions,
  ICoreClientBuilder,
} from "./types";
import AuthClient from "../auth/auth.client";
import UsersClient from "../users/users.client";

export default class CoreClientBuilder implements ICoreClientBuilder {
  protected _auth: AuthClient;
  protected _users: UsersClient;

  constructor({ $url, $fetch }: CoreClientBuilderConstructorOptions) {
    this._auth = new AuthClient({ $url, $fetch });
    this._users = new UsersClient({ $url, $fetch });
  }

  get auth() {
    return this._auth;
  }

  get users() {
    return this._users;
  }
}
