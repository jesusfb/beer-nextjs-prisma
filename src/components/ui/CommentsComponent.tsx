import { FC, MutableRefObject } from 'react';
import { FaArrowUp } from 'react-icons/fa';

import { useInView } from 'react-intersection-observer';

import useBeerPostComments from '@/hooks/data-fetching/beer-comments/useBeerPostComments';

import useBreweryPostComments from '@/hooks/data-fetching/brewery-comments/useBreweryPostComments';
import useBeerStyleComments from '@/hooks/data-fetching/beer-style-comments/useBeerStyleComments';
import NoCommentsCard from '../BeerById/NoCommentsCard';
import LoadingComponent from '../BeerById/LoadingComponent';
import CommentCardBody from '../BeerBreweryComments/CommentCardBody';

type HookReturnType = ReturnType<
  typeof useBeerPostComments | typeof useBreweryPostComments | typeof useBeerStyleComments
>;

type HandleDeleteRequest = (id: string) => Promise<void>;

type HandleEditRequest = (
  id: string,
  data: { content: string; rating: number },
) => Promise<void>;

interface CommentsComponentProps {
  comments: HookReturnType['comments'];
  commentSectionRef: MutableRefObject<HTMLDivElement | null>;
  handleDeleteRequest: HandleDeleteRequest;
  handleEditRequest: HandleEditRequest;
  isAtEnd: HookReturnType['isAtEnd'];
  isLoadingMore: HookReturnType['isLoadingMore'];
  mutate: HookReturnType['mutate'];
  pageSize: number;
  setSize: HookReturnType['setSize'];
  size: HookReturnType['size'];
}

const CommentsComponent: FC<CommentsComponentProps> = ({
  comments,
  commentSectionRef,
  handleDeleteRequest,
  handleEditRequest,
  isAtEnd,
  isLoadingMore,
  mutate,
  pageSize,
  setSize,
  size,
}) => {
  const { ref: penultimateCommentRef } = useInView({
    threshold: 0.1,
    /**
     * When the last comment comes into view, call setSize from useBeerPostComments to
     * load more comments.
     */
    onChange: (visible) => {
      if (!visible || isAtEnd) return;
      setSize(size + 1);
    },
  });

  return (
    <>
      {!!comments.length && (
        <div className="card h-full bg-base-300 pb-6">
          {comments.map((comment, index) => {
            const isLastComment = index === comments.length - 1;

            /**
             * Attach a ref to the last comment in the list. When it comes into view, the
             * component will call setSize to load more comments.
             */
            return (
              <div
                ref={isLastComment ? penultimateCommentRef : undefined}
                key={comment.id}
              >
                <CommentCardBody
                  comment={comment}
                  mutate={mutate}
                  handleDeleteRequest={handleDeleteRequest}
                  handleEditRequest={handleEditRequest}
                />
              </div>
            );
          })}

          {
            /**
             * If there are more comments to load, show a loading component with a
             * skeleton loader and a loading spinner.
             */
            !!isLoadingMore && <LoadingComponent length={pageSize} />
          }

          {
            /**
             * If the user has scrolled to the end of the comments, show a button that
             * will scroll them back to the top of the comments section.
             */
            !!isAtEnd && (
              <div className="flex h-20 items-center justify-center text-center">
                <div
                  className="tooltip tooltip-bottom"
                  data-tip="Scroll back to top of comments."
                >
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    aria-label="Scroll back to top of comments"
                    onClick={() => {
                      commentSectionRef.current?.scrollIntoView({
                        behavior: 'smooth',
                      });
                    }}
                  >
                    <FaArrowUp />
                  </button>
                </div>
              </div>
            )
          }
        </div>
      )}

      {!comments.length && <NoCommentsCard />}
    </>
  );
};

export default CommentsComponent;
