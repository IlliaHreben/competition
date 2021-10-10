import express     from 'express';
import controllers from './controllers';

const router = express.Router();

router.get('/categories', controllers.categories.list);

export default router;
