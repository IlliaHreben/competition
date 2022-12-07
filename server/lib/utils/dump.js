export function dumpCategory(data) {
  const linked = {};

  const fights = data.Fights;
  if (data.Cards) linked.cards = data.Cards.map(dumpCard);
  if (fights) {
    // const degrees = [...new Set(fights.map((f) => f.degree))].sort((a, b) => b - a);
    // const [lastDegree, lastFullDegree] = degrees;
    // const lastDegreeFightsLength = fights.filter((f) => f.degree === lastDegree).length;
    // const isLastDegreeFull = lastDegreeFightsLength === lastDegree;

    // if (!isLastDegreeFull) {
    //   const lastFullDegreeFights = fights.filter((f) => f.degree === lastFullDegree);
    //   const simulatedFights = [];
    //   lastFullDegreeFights.forEach(({ id, ...fight }, _, arr) => {
    //     const childrenCount = fights.filter((f) => f.nextFightId === id).length;
    //     if (childrenCount === 2) return;

    //     if (childrenCount === 0)
    //       simulatedFights.push({
    //         id: randomUUID(),
    //         degree: lastDegree,
    //         nextFightId: id,
    //         orderNumber: 500,
    //         // firstCardId: data.firstCardId,
    //         // secondCardId: data.secondCardId,
    //         categoryId: fight.categoryId,
    //         fightSpaceId: fight.fightSpaceId,
    //         createdAt: fight.createdAt,
    //         updatedAt: fight.updatedAt,
    //         linked: {},
    //       });

    //     simulatedFights.push({
    //       id: randomUUID(),
    //       degree: lastDegree,
    //       nextFightId: id,
    //       orderNumber: 501,
    //       // firstCardId: data.firstCardId,
    //       // secondCardId: data.secondCardId,
    //       categoryId: fight.categoryId,
    //       fightSpaceId: fight.fightSpaceId,
    //       createdAt: fight.createdAt,
    //       updatedAt: fight.updatedAt,
    //       linked: {},
    //     });
    //   });
    //   data.Fights = fights.concat(simulatedFights);
    // }

    linked.fights = data.Fights.map(dumpFight);
  }
  if (data.Section) linked.section = dumpSection(data.Section);

  return {
    id: data.id,
    sectionId: data.sectionId,
    sex: data.sex,
    ageFrom: data.ageFrom,
    ageTo: data.ageTo,
    weightFrom: data.weightFrom,
    weightTo: data.weightTo,
    weightName: data.weightName,
    group: data.group,
    competitionId: data.competitionId,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    linked,
  };
}

export function dumpSection(data) {
  const linked = {};

  if (data.Cards) linked.cards = data.Cards.map(dumpCard);
  if (data.Fights) linked.fights = data.Fights.map(dumpFight);
  if (data.Categories) linked.categories = data.Categories.map(dumpCategory);

  return {
    id: data.id,
    name: data.name,
    type: data.type,
    stateId: data.stateId,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    linked,
  };
}

export function dumpCard(data) {
  const linked = {
    ...(data.Fighter && { fighter: dumpFighter(data.Fighter) }),
    ...(data.Section && { section: dumpSection(data.Section) }),
    ...(data.Category && { category: dumpCategory(data.Category) }),
  };

  return {
    id: data.id,
    fighterId: data.fighterId,
    categoryId: data.categoryId,
    competitionId: data.competitionId,
    sectionId: data.sectionId,
    weight: data.weight,
    realWeight: data.realWeight,
    group: data.group,
    birthDate: data.birthDate,
    age: data.age,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    linked,
  };
}

export function dumpFight(data) {
  const linked = {};

  if (data.FirstCard) linked.firstCard = dumpCard(data.FirstCard);
  if (data.SecondCard) linked.secondCard = dumpCard(data.SecondCard);
  if (data.Category) linked.category = dumpCategory(data.Category);
  if (data.Section) linked.section = dumpSection(data.Section);
  if (data.FightSpace) linked.fightSpace = dumpFightSpace(data.FightSpace);
  if (data.FightFormula) linked.fightFormula = dumpFightFormula(data.FightFormula);

  return {
    id: data.id,
    degree: data.degree,
    orderNumber: data.orderNumber,
    serialNumber: data.serialNumber,
    firstCardId: data.firstCardId,
    secondCardId: data.secondCardId,
    winnerId: data.winnerId,
    nextFightId: data.nextFightId,
    categoryId: data.categoryId,
    fightSpaceId: data.fightSpaceId,
    executedAt: data.executedAt,
    createdAt: data.createdAt,
    deletedAt: data.deletedAt,
    updatedAt: data.updatedAt,
    linked,
  };
}

export function dumpCoach(data) {
  const linked = {};

  if (data.Clubs) linked.clubs = data.Clubs.map(dumpClub);

  return {
    id: data.id,
    name: data.name,
    lastName: data.lastName,
    assistantName: data.assistantName,
    assistantLastName: data.assistantLastName,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    linked,
  };
}

export function dumpClub(data) {
  const linked = {};

  if (data.Coaches) linked.coaches = data.Coaches.map(dumpCoach);
  if (data.Settlement) linked.settlement = dumpSettlement(data.Settlement);

  return {
    id: data.id,
    name: data.name,
    createdAt: data.createdAt,
    deletedAt: data.deletedAt,
    updatedAt: data.updatedAt,
    linked,
  };
}

export function dumpSettlement(data) {
  const linked = {};

  if (data.Cards) linked.cards = data.Cards.map(dumpCard);
  if (data.State) linked.state = dumpState(data.State);

  return {
    id: data.id,
    name: data.name,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    linked,
  };
}

export function dumpState(data) {
  const linked = {};

  if (data.Cards) linked.cards = data.Cards.map(dumpCard);
  if (data.Settlements) linked.settlements = data.Settlements.map(dumpSettlement);

  return {
    id: data.id,
    name: data.name,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    linked,
  };
}

export function dumpFighter(data) {
  const linked = {
    ...(data.Coach && { coach: dumpCoach(data.Coach) }),
    ...(data.Club && { club: dumpClub(data.Club) }),
  };

  return {
    id: data.id,
    name: data.name,
    lastName: data.lastName,
    sex: data.sex,
    clubId: data.clubId,
    secondaryClubId: data.secondaryClubId,
    coachId: data.coachId,
    birthDate: data.birthDate,
    group: data.group,
    age: data.age,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    linked,
  };
}

export function dumpFightSpace(data) {
  return {
    ...data.dataValues,
  };
}

export function dumpCompetition(data, meta = {}) {
  const linked = {};

  if (data.FightSpaces) linked.fightSpace = data.FightSpaces.map(dumpFightSpace);
  if (data.Categories) linked.categories = data.Categories.map(dumpCard);

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    startDate: data.startDate,
    endDate: data.endDate,
    days: data.days,
    cardsCount: meta.cardsCount,
    fightersCount: meta.fightersCount,
    linked,
  };
}

export function dumpFightFormula(data) {
  const linked = {};

  if (data.Cards) linked.cards = data.Cards.map(dumpCard);
  if (data.Fights) linked.cards = data.Fights.map(dumpCard);
  if (data.Section) linked.section = dumpSection(data.Section);

  return {
    id: data.id,

    roundCount: data.roundCount,
    roundTime: data.roundTime,
    breakTime: data.breakTime,

    sectionId: data.sectionId,
    sex: data.sex,
    ageFrom: data.ageFrom,
    ageTo: data.ageTo,
    weightFrom: data.weightFrom,
    weightTo: data.weightTo,
    weightName: data.weightName,
    group: data.group,
    degree: data.degree,

    startAt: data.startAt,
    finishAt: data.finishAt,
    breakStartAt: data.breakStartAt,
    breakFinishAt: data.breakFinishAt,

    competitionId: data.competitionId,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    linked,
  };
}
