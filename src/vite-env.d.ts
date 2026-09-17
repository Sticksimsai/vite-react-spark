/// <reference types="vite/client" />

type InjectedProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, fn: (value: unknown) => void) => void;
  removeListener?: (event: string, fn: (value: unknown) => void) => void;
};

declare global {
  interface Window {
    ethereum?: InjectedProvider;
  }
}

export {};
