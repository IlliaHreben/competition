export function dumpCategory (c) {
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
    updatedAt     : c.updatedAt
  };
}
