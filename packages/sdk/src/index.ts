import type { ClientOptions } from "./core/types";
import { CoreClient } from "./core/core.client";

export const createClient = (url: string, options?: ClientOptions) => {
  return new CoreClient(url, options);
};
