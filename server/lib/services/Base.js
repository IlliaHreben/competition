import ServiceBaseModule from 'chista/ServiceBase';

import '../../lib/registerValidationRules';
import ServiceError  from './service-error';
import x                 from 'chista/Exception';
const Exception = x.default;

const ServiceBase = ServiceBaseModule.default;

export default class Base extends ServiceBase {
    static paginationRules = {
      limit  : [ 'positive_integer' ],
      sort   : [ { one_of: [ 'createdAt', 'updatedAt' ] } ],
      order  : [ 'to_uc', { one_of: [ 'ASC', 'DESC' ] } ],
      offset : [ 'integer', { min_number: 0 } ]
    }

    async run (params) {
      const cleanParams = await this.validate(params);

      return this.execute(cleanParams).catch(this.handleError);
    }

  handleError = error => {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new ServiceError('SequelizeUniqueConstraintError', error);
    }
    if (error.name === 'AggregateError') {
      throw new ServiceError('AggregateError', error);
    }

    if (error instanceof Exception) {
      const { code, data } = error.toHash();

      // eslint-disable-next-line no-unused-expressions
      this.errors?.[code]?.({ code, data });
    }
    throw error;
  }
}
