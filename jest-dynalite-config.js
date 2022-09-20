module.exports = {
  tables: [
    {
      TableName: 'node-typescript-serverless-example-service-acronyms-dev',
      KeySchema: [{AttributeName: 'acronym', KeyType: 'HASH'}],
      AttributeDefinitions: [{AttributeName: 'acronym', AttributeType: 'S'}],
      ProvisionedThroughput: {ReadCapacityUnits: 1, WriteCapacityUnits: 1}
    }
  ],
  region: 'local',
  basePort: 8000
};
