import { inspect } from "util";
import { unpackError } from "utils";

enum Severity {
  Debug,
  Info,
  Warn,
  Error,
}

const severityString = (level: Severity) =>
  ["DEBU", "INFO", "WARN", "ERRO"][level];

interface Config {
  /**
   * @default "text"
   */
  format: "text" | "json";
  /**
   * @default true
   */
  timestamp: boolean;
  /**
   * @default Severity.Info
   */
  minSeverity: Severity;
}

const config: Config = Object.seal({
  format: "text",
  timestamp: true,
  minSeverity: Severity.Info,
});

export const configure = (options: Partial<Config>) => {
  const { format, timestamp, minSeverity } = options;

  if (format === "text" || format === "json") {
    config.format = format;
  }

  if (typeof timestamp === "boolean") {
    config.timestamp = timestamp;
  }

  if (typeof minSeverity === "number" && minSeverity in Severity) {
    config.minSeverity = minSeverity;
  }
};

type Fragment = [string, unknown];

const isFragment = (value: unknown): value is Fragment => {
  if (!Array.isArray(value)) {
    return false;
  }

  if (value.length !== 2) {
    return false;
  }

  if (typeof value[0] !== "string") {
    return false;
  }

  return true;
};

export const fragment = (key: string, value: unknown): Fragment => [key, value];

const stringify = (item: unknown) =>
  inspect(item, {
    compact: true,
    breakLength: Infinity,
    depth: 10,
    colors: true,
    showHidden: false,
  });

export const text = (namespace: string, severity: Severity, ...args: any[]) => {
  const meta: string[] = [];

  if (config.timestamp) {
    meta.push(`[${new Date().toISOString()}]`);
  }

  meta.push(`[${severityString(severity)}]`, `[${namespace}]`);

  const items = [...meta, ...args]
    .filter((item) => item !== undefined && item !== null && item != "")
    .map((item) => {
      if (typeof item !== "object") {
        return item;
      }

      if (isFragment(item)) {
        return `${item[0]}=${stringify(item[1])}`;
      }

      if (item instanceof Error) {
        const { stack, ...error } = unpackError(item, "short");
        return `error=${stringify(error)}`;
      }

      return stringify(item);
    });

  console.log(...items);
};

export const json = (namespace: string, severity: Severity, ...args: any[]) => {
  const meta: Record<string, unknown> = {};

  if (config.timestamp) {
    meta.timestamp = new Date().toISOString();
  }

  meta.severity = severityString(severity);
  meta.namespace = namespace;
  meta.fields = [];

  const result = args.reduce((result, item) => {
    if (isFragment(item)) {
      const [key, value] = item;
      const serialised = value instanceof Error ? unpackError(value) : value;
      return { ...result, [key]: serialised };
    }

    if (item instanceof Error) {
      return { ...result, error: unpackError(item) };
    }

    if (typeof item === "string" && !("message" in result)) {
      return { ...result, message: item };
    }

    result.fields.push(item);
    return result;
  }, meta);

  console.log(stringify(result));
};

const emit = (namespace: string, severity: Severity, ...args: any[]) => {
  const emitter = config.format === "text" ? text : json;
  if (severity >= config.minSeverity) {
    emitter(namespace, severity, ...args);
  }
};

export const debug = (namespace: string, ...args: any[]) =>
  emit(namespace, Severity.Debug, ...args);

export const info = (namespace: string, ...args: any[]) =>
  emit(namespace, Severity.Info, ...args);

export const warn = (namespace: string, ...args: any[]) =>
  emit(namespace, Severity.Warn, ...args);

export const error = (namespace: string, ...args: any[]) =>
  emit(namespace, Severity.Error, ...args);
