export const unpackError = (
  error: any,
  stackDisplay: "none" | "short" | "full" = "full"
) => {
  const unpacked: Record<string, unknown> = {};
  Object.getOwnPropertyNames(error).forEach((name) => {
    if (
      ["code", "message", "status", "errno", "name", "timeout"].includes(name)
    ) {
      unpacked[name] = error[name];
    }
  });

  if (stackDisplay === "none") {
    return unpacked;
  }

  const frames = Array.isArray(unpacked.stack)
    ? unpacked.stack
    : typeof unpacked.stack === "string"
    ? unpacked.stack.split("\n")
    : undefined;

  if (stackDisplay === "full") {
    return { ...unpacked, stack: frames ?? unpacked.stack };
  }

  return { ...unpacked, stack: frames?.slice(0, 1) };
};

type JSONParseSucceeded = { success: true; data: Record<string, unknown> };
type JSONParseFailed = { success: false; error: unknown };
export const tryParseJSON = (
  input: string
): JSONParseSucceeded | JSONParseFailed => {
  try {
    return { success: true, data: JSON.parse(input) };
  } catch (error) {
    return { success: false, error };
  }
};

const MS_IN_DAY = 86400000;

export const timestampToDayMinute = (
  timestamp: string
): { day: number; minute: number } => {
  const epoch = new Date(timestamp).valueOf();
  const day = Math.floor(epoch / MS_IN_DAY);
  const minute = epoch % MS_IN_DAY;
  return { day, minute };
};

export type MaybeSuccess<T, E = unknown> =
  | { success: true; data: T }
  | { success: false; error: E };
