import sequelize, { Op } from '../../sequelize-singleton.js';

export default function getCategoryScopes(category) {
  const Card = sequelize.model('Card');
  const Fight = sequelize.model('Fight');
  const Fighter = sequelize.model('Fighter');
  const Club = sequelize.model('Club');
  const FightFormula = sequelize.model('FightFormula');

  return {
    competitionRelated: (id) => ({
      where: { competitionId: id },
    }),
    sectionId: (sectionId) => ({ where: { sectionId } }),
    group: (group) => ({ where: { group } }),
    sex: (sex) => ({ where: { sex } }),
    weightFrom: (weightFrom) => ({ where: { [Op.gte]: { weightFrom } } }),
    weightTo: (weightTo) => ({ where: { [Op.lte]: { weightTo } } }),
    ageFrom: (ageFrom) => ({ where: { [Op.gte]: { ageFrom } } }),
    ageTo: (ageTo) => ({ where: { [Op.lte]: { ageTo } } }),
    type: (type) => ({ where: { '$Section.type$': type }, include: ['Section'] }),
    cards: (showEmpty, showOnlyEmpty) => ({
      attributes: [
        // sequelize.literal('DISTINCT ON("id") 1'),
        ...Object.keys(category.getAttributes()),
        [
          sequelize.literal(
            '(SELECT COUNT(*) FROM "Cards" WHERE "Cards"."categoryId" = "Category"."id")'
          ),
          'cardsCount',
        ],
      ],
      ...(showOnlyEmpty && {
        where: [
          sequelize.literal(
            '(SELECT COUNT(*) FROM "Cards" WHERE "Cards"."categoryId" = "Category"."id") = 0'
          ),
        ],
      }),
      include: [
        {
          model: Card,
          as: 'Cards',
          required: !showEmpty && !showOnlyEmpty,
          include: [
            {
              model: Fighter,
              as: 'Fighter',
              include: [{ model: Club, as: 'Club', include: 'Settlement' }, 'Coach'],
            },
          ],
        },
        {
          model: Fight,
          as: 'Fights',
          order: [[sequelize.literal('"orderNumber"'), 'DESC']],
        },
      ],
      logging: true,
      order: [
        // [sequelize.literal('"id"'), 'DESC'],
        [sequelize.literal('"cardsCount"'), 'DESC'],
        ['id', 'ASC'],
      ],
    }),
    sections: {
      include: ['Section'],
    },
    cardsWithFighters: {
      include: {
        model: Card,
        as: 'Cards',
        required: true,
        include: ['Fighter'],
        order: [['id', 'ASC']],
      },
    },
    fightsWithFormula: {
      include: {
        model: Fight,
        as: 'Fights',
        required: true,
        include: [{ model: FightFormula, as: 'FightFormula', required: true }],
        order: [['id', 'ASC']],
      },
    },
    search: (search) => ({
      replacements: { search: `%${search}%` },
      where: sequelize.literal(
        `EXISTS (SELECT 1 FROM "Cards" AS "Card" INNER JOIN "Fighters" AS "Fighter" ON "Fighter"."id" = "Card"."fighterId" WHERE "Card"."categoryId" = "Category"."id" AND ("Fighter"."name" ILIKE :search OR "Fighter"."lastName" ILIKE :search) AND "Card"."deletedAt" IS NULL)`
      ),
    }),
    clubId: (clubId) => ({
      replacements: { clubId },
      where: sequelize.literal(
        `EXISTS (SELECT 1 FROM "Cards" AS "Card" INNER JOIN "Fighters" AS "Fighter" ON "Fighter"."id" = "Card"."fighterId" WHERE "Card"."categoryId" = "Category"."id" AND "Fighter"."clubId" = :clubId AND "Card"."deletedAt" IS NULL)`
      ),
    }),
    coachId: (coachId) => ({
      replacements: { coachId },
      where: sequelize.literal(
        `EXISTS (SELECT 1 FROM "Cards" AS "Card" INNER JOIN "Fighters" AS "Fighter" ON "Fighter"."id" = "Card"."fighterId" WHERE "Card"."categoryId" = "Category"."id" AND "Fighter"."coachId" = :coachId AND "Card"."deletedAt" IS NULL)`
      ),
    }),
    settlementId: (settlementId) => ({
      replacements: { settlementId },
      where: sequelize.literal(
        `EXISTS (SELECT 1 FROM "Cards" AS "Card" INNER JOIN "Fighters" AS "Fighter" ON "Fighter"."id" = "Card"."fighterId" INNER JOIN "Clubs" AS "Club" ON "Club"."id" = "Fighter"."clubId" WHERE "Card"."categoryId" = "Category"."id" AND "Club"."settlementId" = :settlementId AND "Card"."deletedAt" IS NULL)`
      ),
    }),
  };
}
