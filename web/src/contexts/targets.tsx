import { ITarget } from "@uptime/lib/models";
import { createContext, PropsWithChildren, useContext } from "react";
import { api } from "../api";
import { useAsync } from "../hooks/useAsync";

export interface Target extends ITarget {
  slug: string;
}

interface TargetsContextValue {
  loading: boolean;
  error?: Error;
  targets: Target[];
  listTargets: () => Promise<void>;
}

const TargetsContext = createContext<TargetsContextValue | undefined>(
  undefined
);

export const useTargets = () => {
  const value = useContext(TargetsContext);
  if (value) {
    return value;
  }

  throw new Error("TargetsContext consumer missing matching provider");
};

export const TargetsProvider = (props: PropsWithChildren<unknown>) => {
  const [state, listTargets] = useAsync(api.listTargets);

  const value: TargetsContextValue = {
    ...state,
    targets: state.value?.targets ?? [],
    listTargets,
  };

  return (
    <TargetsContext.Provider value={value}>
      {props.children}
    </TargetsContext.Provider>
  );
};
