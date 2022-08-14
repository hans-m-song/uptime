import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  PutCommandInput,
  paginateQuery,
  DeleteCommand,
  paginateScan,
  QueryCommandInput,
  ScanCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { getExpressionAttributes, Item, itemAsCondition, Key } from "./utils";

const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const getItem = async <T>(
  tableName: string,
  key: Key
): Promise<T | null> => {
  const command = new GetCommand({ TableName: tableName, Key: key });
  const response = await client.send(command);
  return (response.Item as T) ?? null;
};

export const putItem = async (
  tableName: string,
  item: Item,
  overrides?: Partial<PutCommandInput>
): Promise<void> => {
  const command = new PutCommand({
    TableName: tableName,
    Item: item,
    ...overrides,
  });

  await client.send(command);
};

export const deleteItem = async (tableName: string, key: Key) => {
  const command = new DeleteCommand({ TableName: tableName, Key: key });
  await client.send(command);
};

export const query = async <T>(
  tableName: string,
  key: Key,
  overrides?: Partial<QueryCommandInput>
): Promise<T[]> => {
  const cursor = paginateQuery(
    { client },
    {
      TableName: tableName,
      KeyConditionExpression: itemAsCondition(key),
      ...getExpressionAttributes(key),
      ...overrides,
    }
  );

  const results: T[] = [];
  for await (const page of cursor) {
    if (page.Items) {
      results.push(...(page.Items as T[]));
    }
  }

  return results;
};

export const scan = async <T>(
  tableName: string,
  overrides?: Partial<ScanCommandInput>
): Promise<T[]> => {
  const cursor = paginateScan(
    { client },
    { TableName: tableName, ...overrides }
  );

  const results: T[] = [];
  for await (const page of cursor) {
    if (page.Items) {
      results.push(...(page.Items as T[]));
    }
  }

  return results;
};
