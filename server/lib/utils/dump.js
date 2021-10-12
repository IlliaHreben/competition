export function dumpCategory (c) {
  const linked = {};

  if (c.Cards) linked.Cards = c.Cards.map(dumpCard);

  return {
    id            : c.id,
    section       : c.section,
    sex           : c.sex,
    type          : c.type,
    ageFrom       : c.ageFrom,
    ageTo         : c.ageTo,
    weightFrom    : c.weightFrom,
    weightTo      : c.weightTo,
    weightName    : c.weightName,
    group         : c.group,
    competitionId : c.competitionId,
    createdAt     : c.createdAt,
    updatedAt     : c.updatedAt,
    linked
  };
}

export function dumpCard (c) {
  return {
    id              : c.id,
    fighterId       : c.fighterId,
    clubId          : c.clubId,
    secondaryClubId : c.secondaryClubId,
    coachId         : c.coachId,
    categoryId      : c.categoryId,
    competitionId   : c.competitionId,
    section         : c.section,
    weight          : c.weight,
    realWeight      : c.realWeight,
    group           : c.group,
    city            : c.city,
    birthDate       : c.birthDate,
    age             : c.age,
    createdAt       : c.createdAt,
    updatedAt       : c.updatedAt
  };
}

export function dumpFight (f) {
  return {
    id           : f.id,
    degree       : f.degree,
    orderNumber  : f.orderNumber,
    firstCardId  : f.firstCardId,
    secondCardId : f.secondCardId,
    winnerId     : f.winnerId,
    nextFightId  : f.nextFightId,
    categoryId   : f.categoryId,
    fightSpaceId : f.fightSpaceId,
    executedAt   : f.executedAt,
    createdAt    : f.createdAt,
    deletedAt    : f.deletedAt,
    updatedAt    : f.updatedAt
  };
}
