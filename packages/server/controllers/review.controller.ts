import type { Request, Response } from 'express';
import { reviewService } from '../services/review.service';
import { productRepository } from '../repositories/product.repositories';
import { reviewRepositories } from '../repositories/review.repositories';

export const reviewController = {
  async getReviews(req: Request, res: Response) {
    const productId = Number(req.params.id);

    if (isNaN(productId)) {
      res.status(400).json({ error: 'Invalid product ID' });
      return;
    }

    const product = await productRepository.getProduct(productId);
    if (!product) {
      res.status(404).json({ error: 'Product does not exist' });
      return;
    }

    const reviews = await reviewRepositories.getReviews(productId);
    const summary = await reviewRepositories.getReviewSummary(productId);

    res.json({
      reviews,
      summary,
    });
  },

  async summarizeReviews(req: Request, res: Response) {
    const productId = Number(req.params.id);

    if (isNaN(productId)) {
      res.status(400).json({ error: 'Invalid product ID' });
      return;
    }

    const product = await productRepository.getProduct(productId);
    if (!product) {
      res.status(400).json({ error: 'Invalid product ID' });
      return;
    }

    const reviews = await reviewRepositories.getReviews(productId, 1);
    if (!product) {
      res.status(400).json({ error: 'No reviews' });
      return;
    }

    const summary = await reviewService.summarizeReviews(productId);

    res.json({ summary });
  },
};
