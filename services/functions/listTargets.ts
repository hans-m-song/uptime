import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Target } from "~/models/target";
import { response, StatusCode } from "~/lib/http";

export const handler: APIGatewayProxyHandlerV2 = async () => {
  const targets = await Target.all();

  return response("OK", {
    statusCode: StatusCode.Ok,
    body: { targets },
  });
};
