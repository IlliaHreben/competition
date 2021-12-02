import express     from 'express';
import controllers from './controllers';

const router = express.Router();

router.get('/categories', controllers.categories.list);
router.get('/categories/calculate-fights', controllers.categories.calculateFights);
router.get('/categories/bulk-calculate-fights', controllers.categories.bulkCalculateFights);
router.get('/categories/:id', controllers.categories.show);
router.post('/categories/bulk', controllers.categories.bulkCreate);
router.delete('/categories/bulk', controllers.categories.bulkDelete);

router.get('/sections', controllers.sections.list);
router.get('/sections/:id', controllers.sections.show);
router.delete('/sections', controllers.sections.delete);

router.post('/cards/bulk', controllers.cards.bulkCreate);
router.get('/cards', controllers.cards.list);
router.get('/cards/:id', controllers.cards.show);
router.delete('/cards', controllers.cards.delete);
router.patch('/cards/:id', controllers.cards.update);

router.get('/competitions', controllers.competitions.list);
router.get('/competitions/:id', controllers.competitions.show);
router.post('/competitions', controllers.competitions.create);
router.post('/competitions/:id/activate', controllers.competitions.activate);
router.post('/competitions/:id/complete', controllers.competitions.complete);
router.patch('/competitions/:id', controllers.competitions.update);
router.delete('/competitions', controllers.competitions.delete);

router.get('/fight-spaces', controllers.fightSpaces.list);
router.patch('/fight-spaces/bulk', controllers.fightSpaces.bulkUpdate);

router.get('/clubs', controllers.clubs.list);

router.get('/coaches', controllers.coaches.list);

export default router;
