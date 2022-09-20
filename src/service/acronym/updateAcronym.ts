import { AWSError } from 'aws-sdk';
import { UpdateAcronymRequest } from '../../api/acronym/request';
import dynamodb from '../../dynamodb';
import { InternalServerError, NotFoundError } from '../../error/errors';
import { Acronym } from '../../models/acronym';
import AcronymRepository from '../../repositories/acronym';

const repository: AcronymRepository = new AcronymRepository(dynamodb);

export const updateAcronym = async (id: string, request: UpdateAcronymRequest): Promise<Acronym> => {
  try {
    await repository.updateItem({ acronym: id, ...request });
  } catch (error) {
    if ((error as AWSError).code === 'ConditionalCheckFailedException') {
      throw new NotFoundError();
    }
    
    throw new InternalServerError('There was an error updating the Acronym: ' + id);
  }

  const acronym = await repository.getItemById(id);
  if (!acronym) {
    throw new InternalServerError('There was an error updating the Acronym: ' + id);
  }

  return acronym;
};
