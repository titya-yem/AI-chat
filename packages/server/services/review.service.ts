import { reviewRepositories } from '../repositories/review.repositories';
import { llmClient } from '../llm/client';
import template from '../prompt/summarize.review.txt';

export type Review = {
  id: number;
  author: string;
  rating: number;
  content: string;
  createdAt: Date;
  productId: number;
};

export const reviewService = {
  async summarizeReviews(productId: number): Promise<string> {
    const existingSummary =
      await reviewRepositories.getReviewSummary(productId);
    if (existingSummary) {
      return existingSummary;
    }

    const reviews = await reviewRepositories.getReviews(productId, 10);
    const joinedReviews = reviews.map((r) => r.content).join('\n\n');
    const prompt = template.replace('{{reviews}}', joinedReviews);

    const { text: summary } = await llmClient.generateText({
      model: 'gpt-4.1',
      prompt,
      temperature: 0.2,
      maxTokens: 500,
    });

    await reviewRepositories.storeREviewSummary(productId, summary);
    return summary;
  },
};
