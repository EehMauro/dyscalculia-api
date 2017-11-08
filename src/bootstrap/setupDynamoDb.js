import AWS from 'aws-sdk';

export default function (config) {

  AWS.config.update(config);
  
  let dynamoClient = new AWS.DynamoDB.DocumentClient();

  let dynamoDB = new AWS.DynamoDB();

  return {
    dynamoClient,
    dynamoDB
  }
  
}
