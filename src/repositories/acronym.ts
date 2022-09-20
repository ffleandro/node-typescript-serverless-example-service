import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Acronym, AcronymList } from '../models/acronym';
 
const TABLE_NAME = process.env.ACRONYMS_TABLE || 'node-typescript-serverless-example-service-acronyms-dev';

export default class AcronymRepository {
  tableName: string;
  dynamoDbDocClient: DocumentClient;
    
  constructor(client: DocumentClient) {
    this.tableName = TABLE_NAME;
    this.dynamoDbDocClient = client;
  }
 
  async getItemById(id: string): Promise<Acronym | undefined> {
    return this.dynamoDbDocClient.get({
      TableName: this.tableName,
      ConsistentRead: true,
      Key: { acronym: id },
      ProjectionExpression: 'acronym,description',
    }).promise().then((result) => {
      return Promise.resolve(result.Item as Acronym | undefined);
    });
  }

  async listPaginated(cursor?: string, filter?: string): Promise<AcronymList> {
    const params: DocumentClient.ScanInput = {
      TableName: this.tableName,
      ConsistentRead: false,
      ExclusiveStartKey: cursor ? { id: cursor } : undefined,
      ProjectionExpression: 'acronym,description',
    };

    if (filter) {
      params.FilterExpression = 'contains(#searchable_description, :searchable_description)';
      params.ExpressionAttributeNames = { '#searchable_description': 'searchable_description' };
      params.ExpressionAttributeValues = { ':searchable_description' : filter.toLowerCase() };
    }
    

    return this.dynamoDbDocClient.scan(params)
      .promise().then((result) => {
        return {
          cursor: result.LastEvaluatedKey?.id,
          acronyms: result.Items as Acronym[] || [],
          totalCount: result.ScannedCount
        };
      });
  }
 
  async createItem(acronym: Acronym): Promise<void> {
    const item = {
      ...acronym,
      searchable_description: acronym.description.toLowerCase(),
    };

    return this.dynamoDbDocClient.put({
      TableName: this.tableName,
      Item: item,
      ConditionExpression: 'attribute_not_exists(acronym)',
    }).promise().then(() => Promise.resolve());
  }

  async updateItem(item: Partial<Acronym>): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- specifying a type here would be too complex
    const updates = new Map<string, any>();
    const { acronym } = item;

    if (item.description !== undefined) {
      updates.set('description', item.description);
      updates.set('searchable_description', item.description.toLowerCase());
    }
    
    // XXX didn't like this manual way of updating a document.
    const updateExpression: DocumentClient.UpdateExpression = 'set ' + Array.from(updates.keys())
      .map(k => `#${k} = :${k}`)
      .join(', ');

    const expressionAttributeValues: DocumentClient.ExpressionAttributeValueMap = { };
    const expressionAttributeNames: DocumentClient.ExpressionAttributeNameMap = { };
    for (const [key, value] of updates) {
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = value;
    }
    
    return this.dynamoDbDocClient.update({
      TableName: this.tableName,
      Key: { acronym },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ConditionExpression: 'attribute_exists(acronym)'
    }).promise().then(() => Promise.resolve());
  }

  async deleteItem(id: string): Promise<void> {
    return this.dynamoDbDocClient.delete({
      TableName: this.tableName,
      Key: { acronym: id },
      ConditionExpression: 'attribute_exists(acronym)',
    }).promise().then(() => Promise.resolve());
  }
}
