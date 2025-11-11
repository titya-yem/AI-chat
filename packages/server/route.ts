import { Router } from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.contoller';
import { PrismaClient } from '@prisma/client';
import { reviewController } from './controllers/review.controller';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Hello lamdouy');
});

router.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the API' });
});

router.post('/api/chat', chatController.sendMessage);

router.get('/api/products/:id/reviews', reviewController.getReviews);
router.post(
  '/api/products/:id/reviews/summarize',
  reviewController.summarizeReviews
);

export default router;
