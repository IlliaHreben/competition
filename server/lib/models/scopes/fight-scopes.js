import sequelize, { Op } from '../../sequelize-singleton.js';

export default function getCategoryScopes(category) {
  const Fighter = sequelize.model('Fighter');
  const Coach = sequelize.model('Coach');
  const Club = sequelize.model('Club');
  const Category = sequelize.model('Category');
  const FightFormula = sequelize.model('FightFormula');
  const FightSpace = sequelize.model('FightSpace');
  const Card = sequelize.model('Card');

  return {
    sectionId: (sectionId) => ({
      where: { '$Category.sectionId$': sectionId },
      include: 'Category',
    }),
    group: (group) => ({
      where: { '$Category.group$': group },
      include: 'Category',
    }),
    sex: (sex) => ({
      where: { '$Category.sex$': sex },
      include: 'Category',
    }),
    weightFrom: (weightFrom) => ({
      where: { [Op.gte]: { '$Category.weightFrom$': weightFrom } },
      include: 'Category',
    }),
    weightTo: (weightTo) => ({
      where: { [Op.lte]: { '$Category.weightTo$': weightTo } },
      include: 'Category',
    }),
    ageFrom: (ageFrom) => ({
      where: { [Op.gte]: { '$Category.ageFrom$': ageFrom } },
      include: 'Category',
    }),
    ageTo: (ageTo) => ({
      where: { [Op.lte]: { '$Category.ageTo$': ageTo } },
      include: 'Category',
    }),
    competitionId: (competitionId) => ({
      where: { '$Category.competitionId$': competitionId },
      include: 'Category',
    }),
    type: (type) => ({
      where: { '$Category.Section.type$': type },
      include: [{ as: 'Category', model: Category, include: 'Section' }],
    }),
    fightsCount: (fightsCount) => ({
      replacements: { fightsCount },
      where: [
        sequelize.literal(
          '(SELECT COUNT(*) FROM "Cards" WHERE "Cards"."categoryId" = "Fight"."categoryId") IN (:fightsCount)'
        ),
      ],
    }),
    categoryWithSection: {
      include: [{ model: Category, as: 'Category', include: 'Section' }],
    },
    fightFormula: {
      include: [{ model: FightFormula, as: 'FightFormula' }],
    },
    fightSpace: {
      include: [{ model: FightSpace, as: 'FightSpace' }],
    },
    cardsWithFighter: {
      include: [
        { model: Card, as: 'FirstCard', include: ['Fighter'] },
        { model: Card, as: 'SecondCard', include: ['Fighter'] },
      ],
    },
    cardsWithFighterAndLinked: {
      include: [
        {
          model: Card,
          as: 'FirstCard',
          include: [
            {
              model: Fighter,
              as: 'Fighter',
              include: [
                { model: Coach, as: 'Coach' },
                { model: Club, as: 'Club', include: 'Settlement' },
              ],
            },
          ],
        },
        {
          model: Card,
          as: 'SecondCard',
          include: [
            {
              model: Fighter,
              as: 'Fighter',
              include: [
                { model: Coach, as: 'Coach' },
                { model: Club, as: 'Club', include: 'Settlement' },
              ],
            },
          ],
        },
      ],
    },
    search: (search) => ({
      where: {
        [Op.or]: {
          '$FirstCard.Fighter.name$': { [Op.iLike]: `%${search}%` },
          '$SecondCard.Fighter.name$': { [Op.iLike]: `%${search}%` },
          '$FirstCard.Fighter.lastName$': { [Op.iLike]: `%${search}%` },
          '$SecondCard.Fighter.lastName$': { [Op.iLike]: `%${search}%` },
        },
      },
      include: [
        { model: Card, as: 'FirstCard', include: 'Fighter' },
        { model: Card, as: 'SecondCard', include: 'Fighter' },
      ],
    }),
    fightSpaceId: (fightSpaceId) => ({ where: { fightSpaceId } }),
    clubId: (clubId) => ({
      where: {
        [Op.or]: { '$SecondCard.Fighter.clubId$': clubId, '$FirstCard.Fighter.clubId$': clubId },
      },
      include: [
        { model: Card, as: 'FirstCard', include: 'Fighter' },
        { model: Card, as: 'SecondCard', include: 'Fighter' },
      ],
    }),
    coachId: (coachId) => ({
      where: {
        [Op.or]: {
          '$SecondCard.Fighter.coachId$': coachId,
          '$FirstCard.Fighter.coachId$': coachId,
        },
      },
      include: [
        { model: Card, as: 'FirstCard', include: 'Fighter' },
        { model: Card, as: 'SecondCard', include: 'Fighter' },
      ],
    }),
    settlementId: (settlementId) => ({
      where: {
        [Op.or]: {
          '$FirstCard.Fighter.Club.settlementId$': settlementId,
          '$SecondCard.Fighter.Club.settlementId$': settlementId,
        },
      },
      include: [
        {
          model: Card,
          as: 'FirstCard',
          include: { model: Fighter, as: 'Fighter', include: 'Club' },
        },
        {
          model: Card,
          as: 'SecondCard',
          include: { model: Fighter, as: 'Fighter', include: 'Club' },
        },
      ],
    }),
  };
}
