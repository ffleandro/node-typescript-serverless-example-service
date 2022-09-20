import { AWSError } from 'aws-sdk';

const createAWSError = (code: string) => {
  const error = new Error() as AWSError;
  error.code = code;
  return error;
};
  
export const createConditionalCheckAWSError = () => {
  return createAWSError('ConditionalCheckFailedException');
};
  
export const createUnknownAWSError = () => {
  return createAWSError('MyRandomException');
};
