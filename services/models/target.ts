import { log, MaybeSuccess, slug } from "@uptime/lib";
import { IPartialTarget, ITarget, TargetSchema } from "@uptime/lib/models";
import { config } from "~/config";
import { dynamodb } from "~/lib/dynamodb";

export class Target implements ITarget {
  slug: string;
  url: string;
  name: string;
  lastError?: unknown;

  constructor(target: IPartialTarget) {
    this.slug = target.slug ?? slug(target.url);
    this.url = target.url;
    this.name = target.name;
  }

  static async fromURL(url: string): Promise<MaybeSuccess<Target>> {
    return Target.fromSlug(slug(url));
  }

  static async fromSlug(slug: string): Promise<MaybeSuccess<Target>> {
    const result = await dynamodb.getItem(config.targetTableName, { slug });
    if (!result) {
      return {
        success: false,
        error: new Error(`Target not found: "${slug}"`),
      };
    }

    const parsed = TargetSchema.safeParse(result);
    if (!parsed.success) {
      log.warn(
        "Target.fromSlug",
        "item does not match schema",
        log.fragment("slug", slug),
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
    return { slug: this.slug, url: this.url, name: this.name };
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
