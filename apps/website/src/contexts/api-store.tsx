import { createStore } from "zustand/vanilla";

import type { Client } from "@thread/sdk";

export interface ApiClientState {
  client: Client;
}

// export interface ApiClientAction {}

export type ApiClientStore = ApiClientState;

export const initApiClientStore = (client: Client): ApiClientState => {
  return { client };
};

export const createApiClientStore = (initState: ApiClientState) => {
  return createStore<ApiClientStore>()(() => ({
    ...initState,
  }));
};
