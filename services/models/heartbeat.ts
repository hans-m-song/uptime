import { log } from "@uptime/lib";
import { heartbeatSchema, IHeartbeat } from "@uptime/lib/models";
import { timestampToDayMinute } from "@uptime/lib/utils";
import { config } from "~/config";
import { dynamodb } from "~/lib/dynamodb";

export class Heartbeat implements IHeartbeat {
  day: number;
  minute: number;
  targets: Record<string, number>;

  constructor({ day, minute, targets }: IHeartbeat) {
    this.day = day;
    this.minute = minute;
    this.targets = targets;
  }

  static async fromTimestamp(timestamp: string): Promise<Heartbeat> {
    const { day, minute } = timestampToDayMinute(timestamp);
    return Heartbeat.fromDayMinute(day, minute);
  }

  static async fromDayMinute(day: number, minute: number) {
    const result = await dynamodb.getItem(config.historyTableName, {
      day,
      minute,
    });
    const parsed = heartbeatSchema.parse(result);
    return new Heartbeat(parsed);
  }

  toJSON(): IHeartbeat {
    return { day: this.day, minute: this.minute, targets: this.targets };
  }

  async save(): Promise<boolean> {
    try {
      await dynamodb.putItem(config.historyTableName, this.toJSON());
      return false;
    } catch (error) {
      log.error(
        "Heartbeat.save",
        "failed to save item",
        log.fragment("heartbeat", this.toJSON()),
        error
      );

      return false;
    }
  }

  async delete(): Promise<boolean> {
    try {
      await dynamodb.deleteItem(config.historyTableName, {
        day: this.day,
        minute: this.minute,
      });
      return false;
    } catch (error) {
      log.error(
        "Heartbeat.delete",
        "failed to delete item",
        log.fragment("heartbeat", this.toJSON()),
        error
      );

      return false;
    }
  }
}
