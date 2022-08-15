import { useCallback, useState } from "react";
import { useMounted } from "./useMounted";

export type AsyncState<T> = { loading: boolean; error?: Error; value?: T };
export type AsyncFn = (...args: unknown[]) => Promise<unknown>;

export const useAsync = <
  F extends AsyncFn,
  R extends Awaited<ReturnType<F>>,
  A extends Parameters<F>
>(
  fn: F
): [AsyncState<R>, () => Promise<void>] => {
  const mounted = useMounted();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
  const [value, setValue] = useState<R>();

  const request = useCallback(
    async (...args: A) => {
      if (!mounted) {
        return;
      }

      setLoading(true);
      try {
        const result = await fn(...args);
        setValue(result as R);
      } catch (error) {
        console.error(error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    },
    [fn, mounted]
  );

  return [{ loading, error, value }, request];
};
