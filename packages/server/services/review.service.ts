import { reviewRepositories } from '../repositories/review.repositories';

export type Review = {
  id: number;
  author: string;
  rating: number;
  content: string;
  createdAt: Date;
  productId: number;
};

export const reviewService = {
  async getReviews(productId: Number): Promise<Review[]> {
    return reviewRepositories.getReviews(productId);
  },
};
