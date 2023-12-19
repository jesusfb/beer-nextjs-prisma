import UserContext from '@/contexts/UserContext';

import BeerPostQueryResult from '@/services/posts/beer-post/schema/BeerPostQueryResult';

import { FC, MutableRefObject, useContext, useRef } from 'react';
import { z } from 'zod';
import useBeerPostComments from '@/hooks/data-fetching/beer-comments/useBeerPostComments';
import { useRouter } from 'next/router';
import CreateCommentValidationSchema from '@/services/schema/CommentSchema/CreateCommentValidationSchema';
import {
  deleteBeerPostCommentRequest,
  editBeerPostCommentRequest,
} from '@/requests/comments/beer-comment';
import BeerCommentForm from './BeerCommentForm';

import LoadingComponent from './LoadingComponent';
import CommentsComponent from '../ui/CommentsComponent';

interface BeerPostCommentsSectionProps {
  beerPost: z.infer<typeof BeerPostQueryResult>;
}

const BeerPostCommentsSection: FC<BeerPostCommentsSectionProps> = ({ beerPost }) => {
  const { user } = useContext(UserContext);
  const router = useRouter();

  const pageNum = parseInt(router.query.comments_page as string, 10) || 1;
  const PAGE_SIZE = 15;

  const { comments, isLoading, mutate, setSize, size, isLoadingMore, isAtEnd } =
    useBeerPostComments({ id: beerPost.id, pageNum, pageSize: PAGE_SIZE });

  const commentSectionRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

  const handleDeleteRequest = async (id: string) => {
    deleteBeerPostCommentRequest({ commentId: id });
  };

  const handleEditRequest = async (
    id: string,
    data: z.infer<typeof CreateCommentValidationSchema>,
  ) => {
    editBeerPostCommentRequest({ body: data, commentId: id });
  };

  return (
    <div className="w-full space-y-3" ref={commentSectionRef}>
      <div className="card bg-base-300">
        <div className="card-body h-full">
          {user ? (
            <BeerCommentForm beerPost={beerPost} mutate={mutate} />
          ) : (
            <div className="flex h-52 flex-col items-center justify-center">
              <span className="text-lg font-bold">Log in to leave a comment.</span>
            </div>
          )}
        </div>
      </div>

      {
        /**
         * If the comments are loading, show a loading component. Otherwise, show the
         * comments.
         */
        isLoading ? (
          <div className="card bg-base-300 pb-6">
            <LoadingComponent length={PAGE_SIZE} />
          </div>
        ) : (
          <CommentsComponent
            commentSectionRef={commentSectionRef}
            comments={comments}
            isLoadingMore={isLoadingMore}
            isAtEnd={isAtEnd}
            pageSize={PAGE_SIZE}
            setSize={setSize}
            size={size}
            mutate={mutate}
            handleDeleteRequest={handleDeleteRequest}
            handleEditRequest={handleEditRequest}
          />
        )
      }
    </div>
  );
};

export default BeerPostCommentsSection;
