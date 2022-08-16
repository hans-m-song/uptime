import { useCallback, useState } from "react";
import { useMounted } from "./useMounted";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AsyncFn = (...args: any[]) => Promise<any>;
export type AsyncState<T> = { loading: boolean; error?: Error; value?: T };

export const useAsync = <
  F extends AsyncFn,
  R extends Awaited<ReturnType<F>>,
  A extends Parameters<F>
>(
  fn: F
): [AsyncState<R>, (...args: A) => Promise<void>] => {
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
