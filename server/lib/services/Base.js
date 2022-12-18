import ServiceBaseModule from 'chista/ServiceBase';
import x from 'chista/Exception';

import '../../lib/registerValidationRules';
import ServiceError from './service-error';
import sequelize from '../sequelize-singleton';
const Exception = x.default;

const ServiceBase = ServiceBaseModule.default;

export default class Base extends ServiceBase {
  static paginationRules = {
    limit: ['positive_integer'],
    sort: [{ one_of: ['createdAt', 'updatedAt'] }],
    order: ['to_uc', { one_of: ['ASC', 'DESC'] }],
    offset: ['integer', { min_number: 0 }],
  };

  async run(params) {
    const cleanParams = await this.validate(params);

    return sequelize.transaction(() => {
      return this.execute(cleanParams).catch(this.handleError);
    });
  }

  handleError = (error) => {
    if (['SequelizeUniqueConstraintError', 'AggregateError'].includes(error.name)) {
      error = new ServiceError(error.name, error);
    }
    if (error.name === 'SequelizeDatabaseError') {
      console.error(error.message);
      throw new Error('Internal server error');
    }

    if (error instanceof Exception) {
      const { code, data } = error.toHash();

      this.errors?.[code]?.({ code, data });
    }
    throw error;
  };
}
