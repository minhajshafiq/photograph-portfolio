import { useEffect, useLayoutEffect } from "react";

// Avoids the SSR warning while behaving like useLayoutEffect in the browser.
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
