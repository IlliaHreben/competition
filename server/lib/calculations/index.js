import sequelize, { Op }         from '../sequelize.js';

import Category                  from '../models/Category.js';
import Fighter                   from '../models/Fighter.js';

import { createRequire }         from 'module';
const require = createRequire(import.meta.url);

const cards = require('../../fixtures/cards.json'); // eslint-disable-line import/no-commonjs

(async () => {
  // await Promise.all(
  // cards.map(card => {
  console.time('a');
  console.log(cards.length);
  await Promise.all(cards.map(async card => {
    const age = getAge(card.birthDate);
    const fighter = await Fighter.findById(card.fighterId);
    const category = await Category.findOne({
      where: {
        weightFrom : { [Op.lte]: card.weight },
        weightTo   : { [Op.gte]: card.weight },
        ageFrom    : { [Op.lte]: age },
        ageTo      : { [Op.gte]: age },
        group      : card.group,
        section    : card.section,
        sex        : fighter.sex
      }
    });
    if (!category) console.log(card);
    console.log(category.id);
  }));

  // console.log(category);
  // console.timeEnd('a');
  // })
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
