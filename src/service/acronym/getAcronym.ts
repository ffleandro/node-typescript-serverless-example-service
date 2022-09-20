import dynamodb from '../../dynamodb';
import { NotFoundError } from '../../error/errors';
import { Acronym } from '../../models/acronym';
import AcronymRepository from '../../repositories/acronym';

const repository: AcronymRepository = new AcronymRepository(dynamodb);

export const getAcronym = async (id: string): Promise<Acronym | undefined> => {
  const acronym = await repository.getItemById(id);

  if (!acronym) {
    throw new NotFoundError();
  }

  return acronym;
};
