import express     from 'express';
import controllers from './controllers';

const router = express.Router();

router.get('/categories', controllers.categories.list);
router.get('/categories/calculate-fights', controllers.categories.calculateFights);
router.get('/categories/bulk-calculate-fights', controllers.categories.bulkCalculateFights);
router.get('/categories/:id', controllers.categories.show);
router.post('/categories/bulk', controllers.categories.bulkCreate);
router.delete('/categories/bulk', controllers.categories.bulkDelete);

router.post('/cards/bulk', controllers.cards.bulkCreate);

router.get('/competitions', controllers.competitions.list);
router.get('/competitions/:id', controllers.competitions.show);
router.post('/competitions', controllers.competitions.create);
router.patch('/competitions', controllers.competitions.update);

export default router;
