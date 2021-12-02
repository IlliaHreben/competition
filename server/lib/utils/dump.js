export function dumpCategory (data) {
  const linked = {};

  if (data.Cards) linked.cards = data.Cards.map(dumpCard);
  if (data.Fights) linked.fights = data.Fights.map(dumpFight);
  if (data.Section) linked.section = dumpSection(data.Section);

  return {
    id            : data.id,
    sectionId     : data.sectionId,
    sex           : data.sex,
    ageFrom       : data.ageFrom,
    ageTo         : data.ageTo,
    weightFrom    : data.weightFrom,
    weightTo      : data.weightTo,
    weightName    : data.weightName,
    group         : data.group,
    competitionId : data.competitionId,
    createdAt     : data.createdAt,
    updatedAt     : data.updatedAt,
    linked
  };
}

export function dumpSection (data) {
  const linked = {};

  if (data.Cards) linked.cards = data.Cards.map(dumpCard);
  if (data.Fights) linked.fights = data.Fights.map(dumpFight);
  if (data.Categories) linked.categories = data.Categories.map(dumpCategory);

  return {
    id        : data.id,
    name      : data.name,
    type      : data.type,
    createdAt : data.createdAt,
    updatedAt : data.updatedAt,
    linked
  };
}

export function dumpCard (data) {
  const linked = {
    ...data.Coach && { coach: dumpCoach(data.Coach) },
    ...data.Club && { club: dumpCoach(data.Club) },
    ...data.Fighter && { fighter: dumpFighter(data.Fighter) },
    ...data.Section && { section: dumpSection(data.Section) },
    ...data.Category && { category: dumpCategory(data.Category) }
  };

  return {
    id              : data.id,
    fighterId       : data.fighterId,
    clubId          : data.clubId,
    secondaryClubId : data.secondaryClubId,
    coachId         : data.coachId,
    categoryId      : data.categoryId,
    competitionId   : data.competitionId,
    sectionId       : data.sectionId,
    weight          : data.weight,
    realWeight      : data.realWeight,
    group           : data.group,
    birthDate       : data.birthDate,
    age             : data.age,
    createdAt       : data.createdAt,
    updatedAt       : data.updatedAt,
    linked
  };
}

export function dumpFight (data) {
  const linked = {};

  if (data.FirstCard) linked.firstCard = dumpCard(data.FirstCard);
  if (data.SecondCard) linked.secondCard = dumpCard(data.SecondCard);

  return {
    id           : data.id,
    degree       : data.degree,
    orderNumber  : data.orderNumber,
    firstCardId  : data.firstCardId,
    secondCardId : data.secondCardId,
    winnerId     : data.winnerId,
    nextFightId  : data.nextFightId,
    categoryId   : data.categoryId,
    fightSpaceId : data.fightSpaceId,
    executedAt   : data.executedAt,
    createdAt    : data.createdAt,
    deletedAt    : data.deletedAt,
    updatedAt    : data.updatedAt,
    linked
  };
}

export function dumpCoach (data) {
  const linked = {};

  if (data.Clubs) linked.clubs = data.Clubs.map(dumpClub);

  return {
    id                : data.id,
    name              : data.name,
    lastName          : data.lastName,
    assistantName     : data.assistantName,
    assistantLastName : data.assistantLastName,
    createdAt         : data.createdAt,
    updatedAt         : data.updatedAt,
    linked
  };
}

export function dumpClub (data) {
  const linked = {};

  if (data.Coaches) linked.coaches = data.Coaches.map(dumpClub);
  if (data.Settlement) linked.settlement = dumpSettlement(data.Settlement);

  return {
    id        : data.id,
    name      : data.name,
    createdAt : data.createdAt,
    deletedAt : data.deletedAt,
    updatedAt : data.updatedAt,
    linked
  };
}

export function dumpSettlement (data) {
  const linked = {};

  if (data.Cards) linked.cards = data.Cards.map(dumpCard);

  return {
    id        : data.id,
    name      : data.name,
    createdAt : data.createdAt,
    updatedAt : data.updatedAt,
    linked
  };
}

export function dumpFighter (data) {
  return {
    id        : data.id,
    name      : data.name,
    lastName  : data.lastName,
    sex       : data.sex,
    clubId    : data.clubId,
    coachId   : data.coachId,
    birthDate : data.birthDate,
    group     : data.group,
    age       : data.age,
    createdAt : data.createdAt,
    updatedAt : data.updatedAt
  };
}

export function dumpFightSpace (data) {
  return {
    ...data.dataValues
  };
}

export function dumpCompetition (data, meta = {}) {
  const linked = {};

  if (data.FightSpaces) linked.fightSpace = data.FightSpaces.map(dumpFightSpace);
  if (data.Categories) linked.categories = data.Categories.map(dumpCard);

  return {
    id            : data.id,
    name          : data.name,
    description   : data.description,
    startDate     : data.startDate,
    endDate       : data.endDate,
    days          : data.days,
    clubId        : data.clubId,
    cardsCount    : meta.cardsCount,
    fightersCount : meta.fightersCount,
    linked
  };
}
