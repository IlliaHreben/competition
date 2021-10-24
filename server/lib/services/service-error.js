import X from 'chista/Exception';

const errors = {
  NOT_FOUND: data => ({
    code   : 'NOT_FOUND',
    fields : {
      main    : 'NOT_FOUND',
      _reason : `Entity with id ${data.id} not found.`
    }
  })
};

export class ServiceError extends X {
  constructor (type, data) {
    const errorData = errors[type]?.(data) || { code: 'SERVER_ERROR', fields: { type } };

    super(errorData);
  }
}
