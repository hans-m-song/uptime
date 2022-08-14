import { ScheduledHandler } from "aws-lambda";

export const handler: ScheduledHandler = async (event) => {
  const duration = Date.now() - new Date(event.time).valueOf();
  console.log({ start: event.time, duration });
};
