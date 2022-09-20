import dynamodb from '../../dynamodb';
import { InternalServerError, NotFoundError } from '../../error/errors';
import AcronymRepository from '../../repositories/acronym';
import { AWSError } from 'aws-sdk';

const repository: AcronymRepository = new AcronymRepository(dynamodb);

export const deleteAcronym = async (id: string): Promise<void> => {
  try {
    await repository.deleteItem(id);
  } catch (error) {
    if ((error as AWSError).code === 'ConditionalCheckFailedException') {
      throw new NotFoundError();
    }
    
    throw new InternalServerError('There was an error deleting the Acronym: ' + id);
  }
};
