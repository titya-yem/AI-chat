import { PrismaClient } from '@prisma/client';
import type { Review } from '../services/review.service';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

export const reviewRepositories = {
  async getReviews(productId: number, limit?: number): Promise<Review[]> {
    return prisma.reviews.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  storeREviewSummary(productId: number, summary: string) {
    const now = new Date();
    const expiresAt = dayjs().add(7, 'days').toDate();
    const data = {
      content: summary,
      expiresAt,
      generatedAt: now,
      productId,
    };

    return prisma.summary.upsert({
      where: { productId },
      create: data,
      update: data,
    });
  },

  async getReviewSummary(productId: number): Promise<string | null> {
    const summary = await prisma.summary.findFirst({
      where: {
        AND: [{ productId }, { expiresAt: { gr: new Date() } }],
      },
    });

    return summary ? summary.content : null;
  },
};
