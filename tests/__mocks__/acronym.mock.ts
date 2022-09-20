/* eslint-disable max-len */
export const CREATE_ACRONYM_REQUEST = {
  acronym: 'MYACR',
  description: 'This is a custom acronym',
};

export const CREATE_ACRONYM_INVALID_REQUEST = {
  'my-invalid-param': 'This is an invalid param',
  'another-invalid-param': true
};

export const CREATE_VALIDATION_RESPONSE = {
  'message': 'Validation Error',
  'errors': [
    '"acronym" is required',
    '"description" is required',
    '"my-invalid-param" is not allowed',
    '"another-invalid-param" is not allowed'
  ]
};

export const CREATE_EMPTY_VALIDATION_RESPONSE = {
  'message': 'Validation Error',
  'errors': [
    '"acronym" is required',
    '"description" is required',
  ]
};

export const UPDATE_ACRONYM_REQUEST = {
  description: 'This is an edited custom acronym',
};

export const UPDATE_ACRONYM_INVALID_REQUEST = CREATE_ACRONYM_INVALID_REQUEST;

export const UPDATE_VALIDATION_RESPONSE = {
  'message': 'Validation Error',
  'errors': [
    '"my-invalid-param" is not allowed',
    '"another-invalid-param" is not allowed'
  ]
};

export const CREATE_ACRONYM_RESPONSE = CREATE_ACRONYM_REQUEST;

export const UPDATE_ACRONYM_RESPONSE = {
  ...CREATE_ACRONYM_RESPONSE,
  ...UPDATE_ACRONYM_REQUEST,
};

export const GET_ACRONYM_RESPONSE = CREATE_ACRONYM_RESPONSE;

export const LIST_ACRONYMS_RESPONSE = [
  {
    'acronym': 'ABT',
    'description': 'About'
  },
  {
    'acronym': 'ABT2',
    'description': 'Meaning \'About to\''
  },
  {
    'acronym': 'ABTA',
    'description': 'Meaning Good-bye (signoff)'
  },
  {
    'acronym': 'ABU',
    'description': 'All bugged up'
  },
  {
    'acronym': 'AC',
    'description': 'Acceptable content'
  },
  {
    'acronym': 'ACC',
    'description': 'Anyone can come'
  },
  {
    'acronym': 'ACD',
    'description': 'ALT / CONTROL / DELETE'
  },
  {
    'acronym': 'ACDNT',
    'description': 'Accident (e-mail, Government)'
  },
  {
    'acronym': 'ACE',
    'description': 'Meaning marijuana cigarette'
  },
  {
    'acronym': 'ACK',
    'description': 'Acknowledge'
  },
  {
    'acronym': 'ACPT',
    'description': 'Accept (e-mail, Government)'
  },
  {
    'acronym': 'ACQSTN',
    'description': 'Acquisition (e-mail, Government)'
  },
  {
    'acronym': 'ADAD',
    'description': 'Another day, another dollar'
  },
  {
    'acronym': 'ADBB',
    'description': 'All done, bye-bye'
  },
  {
    'acronym': 'ADD',
    'description': 'Address'
  },
].sort((a, b) => a.acronym.localeCompare(b.acronym));

export const SEARCH_ACRONYMS_RESPONSE = [
  {
    'acronym': 'ABT2',
    'description': 'Meaning \'About to\''
  },
  {
    'acronym': 'ABTA',
    'description': 'Meaning Good-bye (signoff)'
  },
  {
    'acronym': 'ACE',
    'description': 'Meaning marijuana cigarette'
  },
];

export const SEARCH_VALIDATION_RESPONSE = {
  'message': 'Validation Error',
  'errors': [
    '"fake" is not allowed',
    '"another_fake" is not allowed'
  ]
};
