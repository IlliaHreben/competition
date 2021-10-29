import x from 'chista/Exception';
const Exception = x.default;

const errors = {
  NOT_FOUND: data => ({
    code   : 'NOT_FOUND',
    fields : {
      main    : 'NOT_FOUND',
      _reason : `Entity with id ${data.id} not found.`
    }
  })
};

export class ServiceError extends Exception {
  constructor (type, data) {
    const errorData = errors[type]?.(data) || { code: 'SERVER_ERROR', fields: { type } };

    super(errorData);
  }
}
