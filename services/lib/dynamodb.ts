import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  PutCommandInput,
} from "@aws-sdk/lib-dynamodb";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const getItem = async <T>(
  tableName: string,
  key: Record<string, unknown>
): Promise<T | null> => {
  const command = new GetCommand({ TableName: tableName, Key: key });
  const response = await client.send(command);
  return (response.Item as T) ?? null;
};

export const putItem = async (
  tableName: string,
  item: Record<string, unknown>,
  overrides?: Partial<PutCommandInput>
) => {
  const command = new PutCommand({
    TableName: tableName,
    ...getExpressionAttributes(item),
    ...overrides,
  });
  await client.send(command);
};

const getExpressionAttributes = (input: Record<string, unknown>) => {
  const ExpressionAttributeNames = Object.keys(input).reduce(
    (names, key) => ({ ...names, [`#${key}`]: key }),
    {} as Record<string, string>
  );

  const ExpressionAttributeValues = Object.entries(input).reduce(
    (values, [key, value]) => ({ ...values, [`:${key}`]: value }),
    {} as Record<string, unknown>
  );

  const Item = Object.keys(input).reduce(
    (item, key) => ({ ...item, [`#${key}`]: `:${key}` }),
    {} as Record<string, unknown>
  );

  return { ExpressionAttributeNames, ExpressionAttributeValues, Item };
};
