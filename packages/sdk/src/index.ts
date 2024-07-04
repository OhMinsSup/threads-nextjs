import { FetchError } from "ofetch";

import type { Options } from "./api/types";
import { ApiClient } from "./api/api.client.js";

const createClient = (url: string, options?: Options) => {
  return new ApiClient(url, options);
};

export type Client = ReturnType<typeof createClient>;

export { ApiClient, createClient, FetchError };
export * from "./api/types";
