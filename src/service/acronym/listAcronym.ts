import { ListAcronymRequest } from '../../api/acronym/request';
import dynamodb from '../../dynamodb';
import { Acronym, AcronymList } from '../../models/acronym';
import AcronymRepository from '../../repositories/acronym';

const repository: AcronymRepository = new AcronymRepository(dynamodb);

export const listAcronym = async (request: ListAcronymRequest): Promise<Acronym[]> => {
  const { from = 0, limit = 10, search } = request;
  const acronyms = [];
  const maxResults = (from + 1) * limit;
  
  let cursor;
  do {
    const page: AcronymList = await repository.listPaginated(cursor, search);
    acronyms.push(...page.acronyms);
    cursor = page.cursor;
  } while (cursor !== undefined && acronyms.length < maxResults);

  return acronyms
    .sort((a, b) => a.acronym.localeCompare(b.acronym))
    .slice(from * limit, (from + 1) * limit);
};
