import DynamoDB, { ClientConfiguration } from 'aws-sdk/clients/dynamodb';

const params: ClientConfiguration = {
  ...(process.env.DYNAMODB_REGION && {
    region: process.env.DYNAMODB_REGION,
  }),
  ...(process.env.DYNAMODB_ENDPOINT && {
    endpoint: process.env.DYNAMODB_ENDPOINT,
  }),
  ...(process.env.MOCK_DYNAMODB_ENDPOINT && {
    // MOCK_DYNAMODB_ENDPOINT is unique to each test runner: https://www.npmjs.com/package/jest-dynalite
    endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
    sslEnabled: false,
    region: 'local',
  }),
};

const dynamodb = new DynamoDB.DocumentClient(params);

export default dynamodb;
