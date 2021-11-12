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
        // const key = `/${error.index}/${error.key}`;
        // return { ...acc, [key]: error.code };
      }, [])
    }
  })
};

export class ServiceError extends Exception {
  constructor (type, data) {
    const errorData = errors[type]?.(data) || { code: 'SERVER_ERROR', fields: { type } };

    super(errorData);
  }
}
