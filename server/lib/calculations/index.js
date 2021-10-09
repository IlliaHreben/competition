import sequelize, { Op }         from '../sequelize.js';

import Category                  from '../models/Category.js';
import Fighter                   from '../models/Fighter.js';
import Card                      from '../models/Card.js';

import { createRequire }         from 'module';
const require = createRequire(import.meta.url);

const cards = require('../../fixtures/cards.json'); // eslint-disable-line import/no-commonjs

(async () => {
  const c = await Card.create(cards[0]);
  console.log(c);
  // await Promise.all(cards.map(async card => {
  //   const age = getAge(card.birthDate);
  //   const fighter = await Fighter.findById(card.fighterId);
  //   const category = await Category.findOne({
  //     where: {
  //       weightFrom : { [Op.lte]: card.weight },
  //       weightTo   : { [Op.gte]: card.weight },
  //       ageFrom    : { [Op.lte]: age },
  //       ageTo      : { [Op.gte]: age },
  //       group      : card.group,
  //       section    : card.section,
  //       sex        : fighter.sex
  //     }
  //   });
  //   if (!category) console.log(card);
  //   console.log(category.id);
  // }));
})();

function getAge (dateString) {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
