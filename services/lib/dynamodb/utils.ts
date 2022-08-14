export type Item = Record<string, unknown>;
export type Key = Record<string, string | number>;

export const itemAsCondition = (input: Item) =>
  Object.entries(itemAsExpression(input))
    .map(([key, value]) => `${key} = ${value}`)
    .join(" and ");

export const itemAsExpression = (input: Item) =>
  Object.keys(input).reduce(
    (item, key) => ({ ...item, [`#${key}`]: `:${key}` }),
    {} as Item
  );

export const getExpressionAttributes = (input: Item) => {
  const ExpressionAttributeNames = Object.keys(input).reduce(
    (names, key) => ({ ...names, [`#${key}`]: key }),
    {} as Record<string, string>
  );

  const ExpressionAttributeValues = Object.entries(input).reduce(
    (values, [key, value]) => ({ ...values, [`:${key}`]: value }),
    {} as Item
  );

  return { ExpressionAttributeNames, ExpressionAttributeValues };
};
