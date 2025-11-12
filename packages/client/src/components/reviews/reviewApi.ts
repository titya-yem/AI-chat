import axios from 'axios';
import type { ReactNode } from 'react';

export type Review = {
  id: number;
  author: string;
  content: string;
  rating: number;
  createdAt: string;
};

export type GetReviewsResponse = {
  summary: string | null;
  reviews: Review[];
};

export type SummarizeResponse = {
  summary: string | ReactNode;
};

export const reviewsApi = {
  fetchReviews(productId: number) {
    return axios
      .get(`/api/products/${productId}/reviews`)
      .then((res) => res.data);
  },

  summarizeReviews(productId: number) {
    return axios
      .post(`/api/products/${productId}/reviews/summarize`)
      .then((res) => res.data);
  },
};
