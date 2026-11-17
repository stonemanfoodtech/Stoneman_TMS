import { useCallback, useEffect, useRef, useState } from 'react';
import { errorMessage } from './api';

/**
 * Runs an async loader whenever its dependencies change.
 * Ignores stale responses so fast filter changes never show old data.
 */
export function useAsync(loader, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const requestId = useRef(0);

  const run = useCallback(
    async ({ silent = false } = {}) => {
      const id = ++requestId.current;
      if (!silent) setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const data = await loader();
        if (id === requestId.current) setState({ data, error: null, loading: false });
        return data;
      } catch (error) {
        if (id === requestId.current) setState((s) => ({ ...s, error: errorMessage(error), loading: false }));
        return null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );

  useEffect(() => {
    run();
  }, [run]);

  return { ...state, reload: run, setData: (updater) => setState((s) => ({ ...s, data: typeof updater === 'function' ? updater(s.data) : updater })) };
}

export function useDebounced(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
