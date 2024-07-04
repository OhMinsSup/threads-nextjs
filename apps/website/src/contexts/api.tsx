import type { ReactNode } from "react";
import type { StoreApi } from "zustand";
import { createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

import type { Client } from "@thread/sdk";

import type { ApiClientStore } from "./api-store";
import { createApiClientStore, initApiClientStore } from "./api-store";

export const ApiClientContext = createContext<StoreApi<ApiClientStore> | null>(
  null,
);

export interface Props {
  client: Client;
  children: ReactNode;
}

export const ApiClientProvider = ({ children, client }: Props) => {
  const storeRef = useRef<StoreApi<ApiClientStore>>();
  if (!storeRef.current) {
    storeRef.current = createApiClientStore(initApiClientStore(client));
  }

  return (
    <ApiClientContext.Provider value={storeRef.current}>
      {children}
    </ApiClientContext.Provider>
  );
};

export const useApiClientStore = <T,>(
  selector: (store: ApiClientStore) => T,
): T => {
  const context = useContext(ApiClientContext);

  if (!context) {
    throw new Error(`useApiClientStore must be use within ApiClientProvider`);
  }

  return useStore(context, selector);
};

export const useApiClient = () => {
  return useApiClientStore((state) => state.client);
};
