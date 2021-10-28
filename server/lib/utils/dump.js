export function dumpCategory (data) {
  const linked = {};

  if (data.Cards) linked.cards = data.Cards.map(dumpCard);
  if (data.Fights) linked.fights = data.Fights.map(dumpFight);

  return {
    id            : data.id,
    section       : data.section,
    sex           : data.sex,
    type          : data.type,
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

export function dumpCard (data) {
  const linked = {
    ...data.Coach && { coach: dumpCoach(data.Coach) },
    ...data.Club && { club: dumpCoach(data.Club) },
    ...data.Fighter && { fighter: dumpFighter(data.Fighter) }
  };

  return {
    id              : data.id,
    fighterId       : data.fighterId,
    clubId          : data.clubId,
    secondaryClubId : data.secondaryClubId,
    coachId         : data.coachId,
    categoryId      : data.categoryId,
    competitionId   : data.competitionId,
    section         : data.section,
    weight          : data.weight,
    realWeight      : data.realWeight,
    group           : data.group,
    city            : data.city,
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
  return {
    id                : data.id,
    name              : data.name,
    lastName          : data.lastName,
    assistantName     : data.assistantName,
    assistantLastName : data.assistantLastName,
    createdAt         : data.createdAt,
    updatedAt         : data.updatedAt
  };
}

export function dumpClub (data) {
  return {
    id        : data.id,
    name      : data.name,
    createdAt : data.createdAt,
    deletedAt : data.deletedAt,
    updatedAt : data.updatedAt
  };
}

export function dumpFighter (data) {
  return {
    id        : data.id,
    name      : data.name,
    lastName  : data.lastName,
    sex       : data.sex,
    city      : data.city,
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

export function dumpCompetition ({ data, meta = {} }) {
  const linked = {};

  if (data.FightSpaces) linked.fightSpace = dumpFightSpace(data.FightSpaces);
  if (data.Categories) linked.categories = dumpCard(data.Categories);

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
