import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { tryParseJSON } from "@uptime/lib/utils";
import { response, StatusCode } from "~/lib/http";
import { Target } from "~/models/target";
import { TargetSchema } from "@uptime/lib/models/target";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (!event.body) {
    return response("must provide body", {
      statusCode: StatusCode.BadRequest,
    });
  }

  const parsed = tryParseJSON(event.body);
  if (!parsed.success) {
    return response("could not parse body", {
      statusCode: StatusCode.BadRequest,
    });
  }

  const validated = TargetSchema.safeParse(parsed.data);
  if (!validated.success) {
    return response("invalid payload", {
      statusCode: StatusCode.BadRequest,
      body: { issues: validated.error.flatten() },
    });
  }

  const target = new Target(validated.data);
  if (!(await target.save())) {
    return response("failed to save target", {
      statusCode: StatusCode.Error,
    });
  }

  return response("OK", {
    statusCode: StatusCode.Ok,
    body: { target },
  });
};
