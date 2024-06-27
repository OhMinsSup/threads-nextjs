import type { ClientOptions } from "./core/types";
import { CoreClient } from "./core/core.client";

const createClient = (url: string, options?: ClientOptions) => {
  return new CoreClient(url, options);
};

export type Client = ReturnType<typeof createClient>;

export { CoreClient, createClient };
export type {
  TokenResponse,
  SigninResponse,
  SignupResponse,
} from "./auth/types";
export type { GetMeResponse } from "./users/types";
