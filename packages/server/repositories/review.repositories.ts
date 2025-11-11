import { PrismaClient } from '@prisma/client';
import type { Review } from '../services/review.service';

export const reviewRepositories = {
  async getReviews(productId: Number): Promise<Review[]> {
    const prisma = new PrismaClient();

    return prisma.reviews.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });
  },
};
