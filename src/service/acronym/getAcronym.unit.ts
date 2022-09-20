import { CREATE_ACRONYM_REQUEST } from '../../../tests/__mocks__/acronym.mock';
import { NotFoundError } from '../../error/errors';
import AcronymRepository from '../../repositories/acronym';
import { getAcronym } from './getAcronym';

const ACRONYM = CREATE_ACRONYM_REQUEST;

describe('Unit: User can read an Acronym', () => {
  test('tests read an acronym successfully', async () => {
    //Given
    jest.spyOn(AcronymRepository.prototype, 'getItemById')
      .mockImplementation(async () => ACRONYM);

    //When
    const result = await getAcronym(ACRONYM.acronym);

    //Then
    expect(result).toMatchObject(ACRONYM);
  });

  test('tests throws not found error when reading a non existent acronym', async () => {
    //Given
    jest.spyOn(AcronymRepository.prototype, 'getItemById')
      .mockImplementation(async () => undefined);

    //When
    expect(getAcronym(ACRONYM.acronym))
      .rejects
      //Then
      .toThrow(NotFoundError);
  });
});
