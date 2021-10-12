import sequelize, { DT }     from '../sequelize-singleton.js';
import Base                  from './Base.js';

export default class Category extends Base {
  static initRelation () {
    const Card = sequelize.model('Card');
    const Fight = sequelize.model('Fight');

    this.hasMany(Card, {
      as         : 'Cards',
      foreignKey : {
        name      : 'categoryId',
        allowNull : true
      }
    });

    this.hasMany(Fight, {
      as         : 'Fights',
      foreignKey : {
        name      : 'categoryId',
        allowNull : false
      }
    });
  }

  async calculateFights () {
    const Fight = sequelize.model('Fight');

    const previousFights = await this.getFights();
    if (previousFights.some(f => f.winnerId)) {
      throw new Error('Cannot change already fought net');
    }
    await Fight.destroy({
      where: { id: previousFights.map(f => f.id) }
    });

    const cards = await this.getCards({
      include: 'Fighter'
      // order   : [ [ 'weight', 'DESC' ], [ 'age', 'DESC' ] ]
    });

    const fightsObject = [];

    const totalFightsCount = cards.length - 1;
    let stageFightsCount = 1;
    let fightsLeft = totalFightsCount;

    while (stageFightsCount * 2 <= totalFightsCount) { // TODO merge with
      for (let i = 1; i <= stageFightsCount; i++) {
        fightsObject.push({
          orderNumber   : fightsLeft--,
          degree        : stageFightsCount,
          competitionId : this.competitionId,
          categoryId    : this.id
        });
      }
      stageFightsCount *= 2;
    }

    for (let i = 1; i <= fightsLeft; fightsLeft--) { // this
      fightsObject.push({
        orderNumber   : fightsLeft,
        degree        : stageFightsCount,
        competitionId : this.competitionId,
        categoryId    : this.id
      });
    }

    const fights = await Fight.bulkCreate(fightsObject);

    const degrees = [ ...new Set(fights.map(f => f.degree)) ];
    const degreesWithoutFinal = degrees.filter(t => t !== 1);

    await Promise.all(degreesWithoutFinal.map(async degree => {
      const fightsInThisSector = fights
        .filter(f => degree === f.degree)
        .sort((a, b) => b.orderNumber - a.orderNumber);

      const fightsInNextSector = fights
        .filter(f => degree / 2 === f.degree)
        .sort((a, b) => b.orderNumber - a.orderNumber);

      for (const fight of fightsInThisSector) {
        const greaterNextFightWithoutChildren = fightsInNextSector
          .find(({ id }) => fights.filter(f => f.nextFightId === id).length < 2);
        await fight.update({ nextFightId: greaterNextFightWithoutChildren.id });
      };
    }));

    return fights;

    // const firstStageFightsCount =

    // for (let i = 0; i < cards.length; i = i + 2) {}
  }
}

Category.init({
  id: { type: DT.UUID, defaultValue: DT.UUIDV4, primaryKey: true },

  section    : { type: DT.STRING, allowNull: false },
  sex        : { type: DT.ENUM([ 'man', 'woman' ]), allowNull: false },
  type       : { type: DT.ENUM([ 'full', 'light' ]), allowNull: false },
  ageFrom    : { type: DT.INTEGER, allowNull: false },
  ageTo      : { type: DT.INTEGER, allowNull: false },
  weightFrom : { type: DT.FLOAT, allowNull: false },
  weightTo   : { type: DT.FLOAT, allowNull: false },
  weightName : { type: DT.STRING, allowNull: false },
  group      : { type: DT.ENUM([ 'A', 'B' ]), allowNull: true },

  competitionId: { type: DT.UUID, onDelete: 'CASCADE', onUpdate: 'CASCADE', references: { model: 'Competitions', key: 'id' }, allowNull: false },

  createdAt : { type: DT.DATE, allowNull: false },
  deletedAt : { type: DT.DATE, allowNull: true },
  updatedAt : { type: DT.DATE, allowNull: false }
}, {
  sequelize,
  paranoid: true
});
