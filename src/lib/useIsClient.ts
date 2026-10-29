import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

/** False on the server and during hydration; true on the client after mount. */
export function useIsClient(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
