import dynamodb from '../../dynamodb';
import { ConflictError, InternalServerError } from '../../error/errors';
import { Acronym } from '../../models/acronym';
import AcronymRepository from '../../repositories/acronym';
import { CreateAcronymRequest } from '../../api/acronym/request';
import { AWSError } from 'aws-sdk';

const repository: AcronymRepository = new AcronymRepository(dynamodb);

export const createAcronym = async (request: CreateAcronymRequest): Promise<Acronym> => {
  try {
    await repository.createItem(request);
  } catch (error) {
    if ((error as AWSError).code === 'ConditionalCheckFailedException') {
      throw new ConflictError();
    }
    
    throw new InternalServerError('There was an error creating the Acronym: ' + request.acronym);
  }

  const acronym = await repository.getItemById(request.acronym);

  if (!acronym) {
    throw new InternalServerError('There was an error creating the Acronym: ' + request.acronym);
  }

  return acronym;
};
