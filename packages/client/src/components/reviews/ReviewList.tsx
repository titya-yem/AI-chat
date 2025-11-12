import StarRating from './StarRating';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { HiSparkles } from 'react-icons/hi2';
import ReviewSkeleton from './reviewSkeleton';
import {
  reviewsApi,
  type GetReviewsResponse,
  type SummarizeResponse,
} from './reviewApi';

type Props = {
  productId: number;
};

const ReviewList = ({ productId }: Props) => {
  const reviewQuery = useQuery<GetReviewsResponse>({
    queryKey: ['reviews', productId],
    queryFn: () => reviewsApi.fetchReviews(productId),
  });

  const summaryMutation = useMutation<SummarizeResponse>({
    mutationFn: () => reviewsApi.summarizeReviews(productId),
  });

  if (reviewQuery.isLoading) {
    return (
      <div className="flex flex-col gap-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <ReviewSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (reviewQuery.error)
    return <p className="text-red-500">Could not fetch reviews. Try again.</p>;

  if (!reviewQuery?.data?.reviews.length) return null;

  const currentSummary =
    summaryMutation?.data?.summary ?? reviewQuery.data.summary;

  return (
    <div>
      <div className="mb-5">
        {currentSummary ? (
          <p>{currentSummary}</p>
        ) : (
          <div>
            <Button
              onClick={() => summaryMutation.mutate()}
              disabled={summaryMutation.isPending}
              className="cursor-pointer flex items-center gap-2"
            >
              <HiSparkles />
              Summarize
            </Button>

            {summaryMutation.isPending && (
              <div className="py-3">
                <ReviewSkeleton />
              </div>
            )}

            {summaryMutation.isError && (
              <p className="text-red-500">
                Could not summarize reviews. Try again.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5">
        {reviewQuery.data?.reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-700 pb-3">
            <div className="font-semibold">{review.author}</div>
            <div>
              <StarRating value={review.rating} />
            </div>
            <div className="py-2">{review.content}</div>
            <div className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
