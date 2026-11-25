import * as React from "react";
import { createItem, listItems } from "./api";

type ItemsContextValue = {
  items: string[];
  refetch: () => void;
  add: (name: string) => void;
};

const ItemsContext = React.createContext<ItemsContextValue | null>(null);

/** The items context, read through a hook of the app's (after a null check, as shadcn's useSidebar). */
export function useItems() {
  const context = React.useContext(ItemsContext);
  if (!context) {
    throw new Error("useItems must be used within an ItemsProvider.");
  }
  return context;
}

export function ItemsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<string[]>([]);
  const refetch = React.useCallback(() => {
    listItems().then(setItems);
  }, []);
  const value = React.useMemo<ItemsContextValue>(
    () => ({
      items,
      refetch,
      add: (name: string) => {
        createItem(name).then(refetch);
      },
    }),
    [items, refetch],
  );
  return <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>;
}
