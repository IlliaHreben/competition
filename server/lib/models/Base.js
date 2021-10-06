
import Sequelize      from 'sequelize';

export default class Base extends Sequelize.Model {
  static findById (id, opts) {
    return this.findOne({ where: { id } }, opts);
  }
}
