import { createStore } from "zustand/vanilla";

import type { Client } from "@thread/sdk";

export interface ApiClientState {
  client: Client;
}

export interface ApiClientActions {}

export type ApiClientStore = ApiClientState & ApiClientActions;

export const initApiClientStore = (
  state: Pick<ApiClientState, "client">,
): ApiClientState => {
  return state;
};

export const createApiClientStore = (initState: ApiClientState) => {
  return createStore<ApiClientStore>()((set) => ({
    ...initState,
  }));
};
