import { log, timestampToDayMinute } from "@uptime/lib";
import { ScheduledHandler } from "aws-lambda";
import { Target } from "~/models/target";
import axios, { AxiosError } from "axios";
import { Heartbeat } from "~/models/heartbeat";

const PING_TIMEOUT = 5000;
const ping = async (url: string): Promise<number> => {
  try {
    const result = await axios.get(url, { timeout: PING_TIMEOUT });
    return result.status;
  } catch (error) {
    log.warn("createHeartbeat.ping", "failed", error);
    return (error as AxiosError).response?.status ?? 0;
  }
};

export const handler: ScheduledHandler = async (event) => {
  const pendingTargets = await Target.all();

  const duration = Date.now() - new Date(event.time).valueOf();
  const results = await Promise.all(
    pendingTargets.map((target) => ping(target.url))
  );

  const targets = results.reduce(
    (targets, result, index) => ({
      ...targets,
      [pendingTargets[index].url]: result,
    }),
    {} as Record<string, number>
  );

  const heartbeat = new Heartbeat({
    ...timestampToDayMinute(event.time),
    targets,
  });

  await heartbeat.save();

  log.info("createHeartbeat", log.fragment("duration", duration));
};
