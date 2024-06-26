"use client";

import { useMemo, useReducer } from "react";

import { createContext } from "@thread/hooks/utils/context";
import { createClient } from "@thread/sdk";

import { env } from "~/env";

interface SdkClientState {
  $client: ReturnType<typeof createClient>;
}

interface SdkClientContext extends SdkClientState {
  dispatch: React.Dispatch<void>;
}

const initialState: SdkClientState = {
  $client: createClient(env.NEXT_PUBLIC_SERVER_URL),
};

const [Provider, useSdkClientContext] = createContext<SdkClientContext>({
  name: "useSdkClientContext",
  errorMessage: "useSdkClientContext: `context` is undefined.",
  defaultValue: initialState,
});

function reducer(state = initialState) {
  return state;
}

interface Props {
  children: React.ReactNode;
}

function SdkClientProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo(
    () => ({
      ...state,
      dispatch,
    }),
    [state],
  );

  return <Provider value={actions}>{children}</Provider>;
}

export { SdkClientProvider, useSdkClientContext };
