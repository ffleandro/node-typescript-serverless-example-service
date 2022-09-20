import { CREATE_ACRONYM_REQUEST, UPDATE_ACRONYM_REQUEST } from '../../../tests/__mocks__/acronym.mock';
import { createConditionalCheckAWSError, createUnknownAWSError } from '../../../tests/__utils__/awsErrors';
import { InternalServerError, NotFoundError } from '../../error/errors';
import AcronymRepository from '../../repositories/acronym';
import { updateAcronym } from './updateAcronym';

const ACRONYM = CREATE_ACRONYM_REQUEST;
const ACRONYM_UPDATE = UPDATE_ACRONYM_REQUEST;

describe('Unit: User can update an Acronym', () => {
  test('tests update an acronym successfully', async () => {
    //Given
    jest.spyOn(AcronymRepository.prototype, 'updateItem')
      .mockImplementation(async () => { return; });

    jest.spyOn(AcronymRepository.prototype, 'getItemById')
      .mockImplementation(async () => { return { ...ACRONYM, ...ACRONYM_UPDATE};});

    //When
    const result = await updateAcronym(ACRONYM.acronym, ACRONYM_UPDATE);

    //Then
    expect(result).toMatchObject({ ...ACRONYM, ...ACRONYM_UPDATE});
  });

  test('tests throws not found error when updating a non existent acronym', async () => {
    //Given
    jest.spyOn(AcronymRepository.prototype, 'updateItem')
      .mockImplementation(async () => { throw createConditionalCheckAWSError(); });

    //When
    expect(updateAcronym(ACRONYM.acronym, ACRONYM_UPDATE))
      .rejects
      //Then
      .toThrow(NotFoundError);
  });

  test('tests throws internal server error when handling an unknown AWSError', async () => {
    //Given
    jest.spyOn(AcronymRepository.prototype, 'updateItem')
      .mockImplementation(async () => { throw createUnknownAWSError(); });

    //When
    expect(updateAcronym(ACRONYM.acronym, ACRONYM_UPDATE))
      .rejects
      //Then
      .toThrow(InternalServerError);
  });

  test('tests throws internal server error when not finding acronym after updating', async () => {
    //Given
    jest.spyOn(AcronymRepository.prototype, 'updateItem')
      .mockImplementation(async () => { return; });

    jest.spyOn(AcronymRepository.prototype, 'getItemById')
      .mockImplementation(async () => undefined);

    //When
    expect(updateAcronym(ACRONYM.acronym, ACRONYM_UPDATE))
      .rejects
      //Then
      .toThrow(InternalServerError);
  });
});
