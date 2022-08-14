import { log, MaybeSuccess } from "@uptime/lib";
import { ITarget, TargetSchema } from "@uptime/lib/models";
import { config } from "~/config";
import { dynamodb } from "~/lib/dynamodb";

export class Target implements ITarget {
  url: string;
  name: string;
  lastError?: unknown;

  constructor({ url, name }: ITarget) {
    this.url = url;
    this.name = name;
  }

  static async fromURL(url: string): Promise<MaybeSuccess<Target>> {
    const result = await dynamodb.getItem(config.targetTableName, { url });
    if (!result) {
      return { success: false, error: new Error(`Target not found: "${url}"`) };
    }

    const parsed = TargetSchema.safeParse(result);
    if (!parsed.success) {
      log.warn(
        "Target.fromURL",
        "item does not match schema",
        log.fragment("url", url),
        log.fragment("error", parsed.error.flatten())
      );
      return { success: false, error: parsed.error };
    }

    return { success: true, data: new Target(parsed.data) };
  }

  static async all(): Promise<Target[]> {
    const results = await dynamodb.scan(config.targetTableName);
    return results
      .map((result) => {
        const parsed = TargetSchema.safeParse(result);
        if (!parsed.success) {
          log.warn(
            "Target.all",
            "item does not match schema",
            log.fragment("error", parsed.error.flatten())
          );

          return null;
        }

        return new Target(parsed.data);
      })
      .filter((item): item is Target => !!item);
  }

  toJSON(): ITarget {
    return { url: this.url, name: this.name };
  }

  async save(): Promise<boolean> {
    try {
      await dynamodb.putItem(config.targetTableName, this.toJSON(), {
        ExpressionAttributeNames: { "#url": "url" },
        ConditionExpression: "attribute_not_exists(#url)",
      });
      return true;
    } catch (error) {
      log.error(
        "Target.save",
        "failed to put item",
        log.fragment("target", this.toJSON()),
        error
      );

      return false;
    }
  }

  async delete(): Promise<boolean> {
    try {
      await dynamodb.deleteItem(config.targetTableName, { url: this.url });
      return true;
    } catch (error) {
      log.error(
        "Target.delete",
        "failed to delete item",
        log.fragment("target", this.toJSON()),
        error
      );

      return false;
    }
  }
}
