import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";

export enum StatusCode {
  Ok = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  Conflict = 409,
  Error = 500,
}

export const response = (
  message: string,
  input: Omit<APIGatewayProxyStructuredResultV2, "body"> & {
    body?: Record<string, unknown>;
  }
): APIGatewayProxyStructuredResultV2 => ({
  ...input,
  body: JSON.stringify({ message, ...input.body }),
});
