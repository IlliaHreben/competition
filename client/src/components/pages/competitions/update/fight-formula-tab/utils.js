import { objectCombos } from '../../../../../utils/common';

export const formatFF = (ff, sections) => ({
  ...ff,
  sectionId: ff.sectionId ? [ff.sectionId] : [],
  degree: ff.degree ? [ff.degree] : [],
  group: ff.group ? [ff.group] : [],
  sex: ff.sex ? [ff.sex] : [],
  roundCount: ff.roundCount || ''
});

export const prepareToSend = (ff, sections) => {
  const sectionId = ff.sectionId?.length ? ff.sectionId : sections.map((s) => s.id);
  const degree = ff.degree?.length ? ff.degree : [undefined];
  const group = ff.group?.length ? ff.group : ['A', 'B'];
  const sex = ff.sex?.length ? ff.sex : ['man', 'woman'];

  const commonAttributes = {
    ...ff,
    weightFrom: ff.weightFrom === 10 || !ff.weightFrom ? 0 : ff.weightFrom,
    weightTo: ff.weightTo === 100 || !ff.weightTo ? 999 : ff.weightTo,
    ageFrom: ff.ageFrom === 1 || !ff.ageFrom ? 0 : ff.ageFrom,
    ageTo: ff.ageTo === 100 || !ff.ageTo ? 999 : ff.ageTo,
    id: ff.id
  };

  const distinctAttributes = Object.entries({
    sectionId,
    degree,
    group,
    sex
  });

  return objectCombos(distinctAttributes).map((attributes) => ({
    ...commonAttributes,
    ...attributes
  }));
};
