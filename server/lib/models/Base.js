
import Sequelize from 'sequelize';

export default class Base extends Sequelize.Model {
  static findById (id, params, opts) {
    return this.findOne({ where: { id }, ...params }, opts);
  }
}
