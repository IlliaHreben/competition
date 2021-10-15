export function dumpCategory (c) {
  const linked = {};

  if (c.Cards) linked.cards = c.Cards.map(dumpCard);

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
  const linked = {};

  if (c.Coach) linked.coach = dumpCoach(c.coach);
  if (c.Club) linked.club = dumpClub(c.Club);

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
    updatedAt       : c.updatedAt,
    linked
  };
}

export function dumpFight (f) {
  const linked = {};

  if (f.FirstCard) linked.firstCard = dumpCard(f.FirstCard);
  if (f.SecondCard) linked.secondCard = dumpCard(f.SecondCard);

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
    updatedAt    : f.updatedAt,
    linked
  };
}

export function dumpCoach (c) {
  return {
    id                : c.id,
    name              : c.name,
    lastName          : c.lastName,
    assistantName     : c.assistantName,
    assistantLastName : c.assistantLastName,
    createdAt         : c.createdAt,
    updatedAt         : c.updatedAt
  };
}

export function dumpClub (c) {
  return {
    id        : c.id,
    name      : c.name,
    createdAt : c.createdAt,
    deletedAt : c.deletedAt,
    updatedAt : c.updatedAt
  };
}
