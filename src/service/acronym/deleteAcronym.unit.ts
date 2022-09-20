import { CREATE_ACRONYM_REQUEST } from '../../../tests/__mocks__/acronym.mock';
import { createConditionalCheckAWSError, createUnknownAWSError } from '../../../tests/__utils__/awsErrors';
import { InternalServerError, NotFoundError } from '../../error/errors';
import AcronymRepository from '../../repositories/acronym';
import { deleteAcronym } from './deleteAcronym';

const ACRONYM_ID = CREATE_ACRONYM_REQUEST.acronym;

describe('Unit: User can delete an Acronym', () => {
  test('tests delete an acronym successfully', async () => {
    //Given
    jest.spyOn(AcronymRepository.prototype, 'deleteItem')
      .mockImplementation(async () => { return; });

    //When
    const result = await deleteAcronym(ACRONYM_ID);

    //Then
    expect(result).toBeUndefined();
  });

  test('tests throws not found error when deleting a non existent acronym', async () => {
    //Given
    jest.spyOn(AcronymRepository.prototype, 'deleteItem')
      .mockImplementation(async () => { throw createConditionalCheckAWSError(); });

    //When
    expect(deleteAcronym(ACRONYM_ID))
      .rejects
      //Then
      .toThrow(NotFoundError);
  });

  test('tests throws internal server error when handling an unknown AWSError', async () => {
    //Given
    jest.spyOn(AcronymRepository.prototype, 'deleteItem')
      .mockImplementation(async () => { throw createUnknownAWSError(); });

    //When
    expect(deleteAcronym(ACRONYM_ID))
      .rejects
      //Then
      .toThrow(InternalServerError);
  });
});
