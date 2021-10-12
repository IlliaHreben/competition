import ServiceBase       from '../Base.js';
import { dumpCard }      from '../../utils';

import Card              from '../../models/Card.js';

const sections = [
  'full-contact', 'low-kick', 'K-1', 'low-kick-light',
  'K-1-light', 'light-contact', 'semi-contact', 'point-fighting'
];

const fullSections = sections.slice(0, 3);

export default class CountriesList extends ServiceBase {
    static validationRules = {
      competitionId : [ 'required', 'uuid' ],
      data          : [ 'required', {
        list_of_objects: [ {
          fighterId       : [ 'required', 'uuid' ],
          clubId          : [ 'required', 'uuid' ],
          secondaryClubId : [ 'uuid' ],
          coachId         : [ 'required', 'uuid' ],
          section         : [ 'required', { one_of: sections } ],
          weight          : [ 'required', { number_between: [ 0, 999 ] } ],
          realWeight      : [ { number_between: [ 0, 999 ] } ],
          group           : [ { or: fullSections.map(s => ({ required_if: { section: s } })) }, { one_of: [ 'A', 'B' ] } ],
          city            : [ 'required', 'string' ],
          birthDate       : [ 'required', 'iso_date' ]
        } ]
      } ]
    };

    async execute ({ competitionId, data }) {
      const cardsWithCompetition = data.map(c => ({ competitionId, ...c }));
      const cards = await Card.bulkCreate(cardsWithCompetition, { individualHooks: true });

      return {
        data: cards.map(dumpCard)
        // meta : {
        //   totalCount,
        //   filteredCount,
        //   limit,
        //   offset
        // }
      };
    }
}
