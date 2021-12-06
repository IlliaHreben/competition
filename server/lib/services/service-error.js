import x from 'chista/Exception';
const Exception = x.default;

const errors = {
  NOT_FOUND: data => ({
    code   : 'NOT_FOUND',
    fields : {
      main    : 'NOT_FOUND',
      _reason : `Entity with id ${data.id} not found.`
    }
  }),
  CLUB_NOT_FOUND: data => ({
    code   : 'NOT_FOUND',
    fields : {
      main: 'CLUB_NOT_FOUND'
    }
  }),
  COACH_NOT_FOUND: data => ({
    code   : 'NOT_FOUND',
    fields : {
      main: 'COACH_NOT_FOUND'
    }
  }),
  SECTION_NOT_FOUND: data => ({
    code   : 'NOT_FOUND',
    fields : {
      main: 'SECTION_NOT_FOUND'
    }
  }),
  FIGHTER_NOT_FOUND: data => ({
    code   : 'NOT_FOUND',
    fields : {
      main: 'FIGHTER_NOT_FOUND'
    }
  }),
  SETTLEMENT_NOT_FOUND: data => ({
    code   : 'NOT_FOUND',
    fields : {
      main: 'SETTLEMENT_NOT_FOUND'
    }
  }),
  GROUP_DOES_NOT_EXIST: data => ({
    code   : 'VALIDATION_ERROR',
    fields : {
      main: 'GROUP_DOES_NOT_EXIST'
    }
  }),
  GROUP_CANNON_EXIST: data => ({
    code   : 'VALIDATION_ERROR',
    fields : {
      main: 'GROUP_CANNON_EXIST'
    }
  }),
  AggregateError: data => ({
    code   : 'VALIDATION_ERROR',
    fields : {
      main: 'VALIDATION_ERROR',
      ...data.errors.reduce((acc, error) => {
        const nestedErrors = error.errors.errors
          .reduce((acc2, error2) => ({ ...acc2, [error2.path]: error2.message }), {});
        return { ...acc, ...nestedErrors };
      }, {})
    }
  }),
  CATEGORIES_VALIDATION: data => ({
    code   : 'VALIDATION_ERROR',
    fields : {
      main : 'CATEGORIES_VALIDATION',
      data : data.reduce((acc, { index, code, key }) => {
        acc[index]
          ? acc[index][key] = code
          : acc[index] = { [key]: code };
        return acc;
      }, [])
    }
  }),
  CATEGORY_VALIDATION: data => ({
    code   : 'VALIDATION_ERROR',
    fields : {
      main : 'CATEGORY_VALIDATION',
      data : data.reduce((acc, { code, key }) => {
        acc.data[key] = code;
        return acc;
      }, { data: {} })
    }
  }),
  IS_ACTIVE: () => ({
    code   : 'CANNOT_BE_DELETED',
    fields : { main: 'IS_ACTIVE' }
  }),
  HAS_UNCOMPLETED_FIGHTS: () => ({
    code   : 'CANNOT_BE_COMPLETED',
    fields : { main: 'HAS_UNCOMPLETED_FIGHTS' }
  })
};

export default class ServiceError extends Exception {
  constructor (type, data) {
    const defaultError = { code: 'SERVER_ERROR', fields: { type } };
    const errorData = errors[type]?.(data) || defaultError;

    super(errorData);
  }
}
