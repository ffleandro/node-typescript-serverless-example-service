import { LIST_ACRONYMS_RESPONSE } from '../../../tests/__mocks__/acronym.mock';
import AcronymRepository from '../../repositories/acronym';
import { listAcronym } from './listAcronym';

const ACRONYMS_LIST = LIST_ACRONYMS_RESPONSE;

describe('Unit: User can search and list paginated Acronyms', () => {
  test('tests list all acronyms successfully', async () => {
    //Given
    const spy = jest.spyOn(AcronymRepository.prototype, 'listPaginated')
      .mockImplementationOnce(async () => { return { cursor: 'cursor-1', acronyms: ACRONYMS_LIST.slice(0, 5) };})
      .mockImplementationOnce(async () => { return { cursor: 'cursor-2', acronyms: ACRONYMS_LIST.slice(5, 10) };})
      .mockImplementationOnce(async () => { return { cursor: undefined, acronyms: ACRONYMS_LIST.slice(10, 15) };});

    //When
    const result = await listAcronym({ limit: 20 });

    //Then
    expect(result).toHaveLength(15);
    expect(result).toMatchObject(ACRONYMS_LIST);
    expect(spy).toHaveBeenCalledTimes(3);
  });

  test('tests get an acronym page successfully', async () => {
    //Given
    const spy = jest.spyOn(AcronymRepository.prototype, 'listPaginated')
      .mockImplementationOnce(async () => { return { cursor: 'cursor-1', acronyms: ACRONYMS_LIST.slice(0, 5) };})
      .mockImplementationOnce(async () => { return { cursor: 'cursor-2', acronyms: ACRONYMS_LIST.slice(5, 10) };})
      .mockImplementationOnce(async () => { return { cursor: undefined, acronyms: ACRONYMS_LIST.slice(10, 15) };});

    //When
    const result = await listAcronym({ from: 1, limit: 5 });

    //Then
    expect(result).toHaveLength(5);
    expect(result).toMatchObject(ACRONYMS_LIST.slice(5, 10));
    expect(spy).toHaveBeenCalledTimes(2);
  });

  test('tests searching first acronyms page successfully', async () => {
    //Given
    const spy = jest.spyOn(AcronymRepository.prototype, 'listPaginated')
      .mockImplementationOnce(async () => { return { cursor: undefined, acronyms: ACRONYMS_LIST };});

    //When
    const result = await listAcronym({search: 'my-query' });

    //Then
    expect(result).toHaveLength(10);
    expect(result).toMatchObject(ACRONYMS_LIST.slice(0, 10));
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('tests searching second acronyms page successfully', async () => {
    //Given
    const spy = jest.spyOn(AcronymRepository.prototype, 'listPaginated')
      .mockImplementationOnce(async () => { return { cursor: undefined, acronyms: ACRONYMS_LIST.slice(7, 15) };});

    //When
    const result = await listAcronym({ from: 1, limit: 5, search: 'my-query' });

    //Then
    expect(result).toHaveLength(3);
    expect(result).toMatchObject(ACRONYMS_LIST.slice(12, 15));
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
