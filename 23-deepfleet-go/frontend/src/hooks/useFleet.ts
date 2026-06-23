// F5 fe-hook: a custom hook returns a function that calls fetch('/api/f5').
import { useCallback } from 'react';

export function useF5Loader() {
  // Returned function calls fetch with a STATIC literal.
  const loadF5 = useCallback(async () => {
    const res = await fetch('/api/f5');
    return res.json();
  }, []);
  return { loadF5 };
}
