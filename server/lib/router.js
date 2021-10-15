import express     from 'express';
import controllers from './controllers';

const router = express.Router();

router.get('/categories', controllers.categories.list);
router.get('/categories/calculate-fights', controllers.categories.calculateFights);
router.get('/categories/:id', controllers.categories.show);

router.post('/cards/bulk', controllers.cards.bulkCreate);

export default router;
