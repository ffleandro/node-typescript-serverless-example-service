import { createConditionalCheckAWSError, createUnknownAWSError } from '../../../tests/__utils__/awsErrors';
import { ConflictError, InternalServerError } from '../../error/errors';
import AcronymRepository from '../../repositories/acronym';
import { createAcronym } from './createAcronym';

const ACRONYM = {
  acronym: 'MYACR',
  description: 'This is a custom acronym',
};

describe('Unit: User can create an Acronym', () => {
  test('tests create an acronym successfully', async () => {
    //Given
    jest.spyOn(AcronymRepository.prototype, 'createItem')
      .mockImplementation(async () => { return; });

    jest.spyOn(AcronymRepository.prototype, 'getItemById')
      .mockImplementation(async () => ACRONYM);

    //When
    const result = await createAcronym(ACRONYM);

    //Then
    expect(result).toMatchObject(ACRONYM);
  });

  test('tests throws conflict error when creating a duplicate acronym', async () => {
    //Given
    jest.spyOn(AcronymRepository.prototype, 'createItem')
      .mockImplementation(async () => { throw createConditionalCheckAWSError(); });

    //When
    expect(createAcronym(ACRONYM))
      .rejects
      //Then
      .toThrow(ConflictError);
  });

  test('tests throws internal server error when handling an unknown AWSError', async () => {
    //Given
    jest.spyOn(AcronymRepository.prototype, 'createItem')
      .mockImplementation(async () => { throw createUnknownAWSError(); });

    //When
    expect(createAcronym(ACRONYM))
      .rejects
      //Then
      .toThrow(InternalServerError);
  });

  test('tests throws internal server error when not finding acronym after creation', async () => {
    //Given
    jest.spyOn(AcronymRepository.prototype, 'createItem')
      .mockImplementation(async () => { return; });

    jest.spyOn(AcronymRepository.prototype, 'getItemById')
      .mockImplementation(async () => undefined);

    //When
    expect(createAcronym(ACRONYM))
      .rejects
      //Then
      .toThrow(InternalServerError);
  });
});
