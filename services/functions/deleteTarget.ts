import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { response, StatusCode } from "~/lib/http";
import { Target } from "~/models/target";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (!event.pathParameters?.slug) {
    return response("must provide slug", {
      statusCode: StatusCode.BadRequest,
    });
  }

  const target = await Target.fromURL(event.pathParameters.slug);
  if (!target.success) {
    return response("OK", {
      statusCode: StatusCode.Ok,
    });
  }

  if (!(await target.data.delete())) {
    return response("failed to delete target", {
      statusCode: StatusCode.Error,
    });
  }

  return response("OK", {
    statusCode: StatusCode.Ok,
  });
};
