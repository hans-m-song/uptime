import { ScheduledHandler } from "aws-lambda";

const targets = {};

export const handler: ScheduledHandler = async (event) => {
  const duration = Date.now() - new Date(event.time).valueOf();
  console.log({ start: event.time, duration });
};
