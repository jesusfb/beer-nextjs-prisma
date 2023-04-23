import UserContext from '@/contexts/userContext';
import useTimeDistance from '@/hooks/useTimeDistance';
import { format } from 'date-fns';
import { Dispatch, FC, SetStateAction, useContext } from 'react';
import { Link, Rating } from 'react-daisyui';
import BeerCommentQueryResult from '@/services/BeerComment/schema/BeerCommentQueryResult';
import { useInView } from 'react-intersection-observer';
import { z } from 'zod';
import CommentCardDropdown from './CommentCardDropdown';

interface CommentContentBodyProps {
  comment: z.infer<typeof BeerCommentQueryResult>;
  ref: ReturnType<typeof useInView>['ref'] | undefined;
  setInEditMode: Dispatch<SetStateAction<boolean>>;
}

const CommentContentBody: FC<CommentContentBodyProps> = ({
  comment,
  ref,
  setInEditMode,
}) => {
  const { user } = useContext(UserContext);
  const timeDistance = useTimeDistance(new Date(comment.createdAt));

  return (
    <div className="card-body animate-in fade-in-10" ref={ref}>
      <div className="flex flex-row justify-between">
        <div>
          <h3 className="font-semibold sm:text-2xl">
            <Link href={`/users/${comment.postedBy.id}`} className="link-hover link">
              {comment.postedBy.username}
            </Link>
          </h3>
          <h4 className="italic">
            posted{' '}
            <time
              className="tooltip tooltip-bottom"
              data-tip={format(new Date(comment.createdAt), 'MM/dd/yyyy')}
            >
              {timeDistance}
            </time>{' '}
            ago
          </h4>
        </div>

        {user && <CommentCardDropdown comment={comment} setInEditMode={setInEditMode} />}
      </div>

      <div className="space-y-1">
        <Rating value={comment.rating}>
          {Array.from({ length: 5 }).map((val, index) => (
            <Rating.Item
              name="rating-1"
              className="mask mask-star cursor-default"
              disabled
              aria-disabled
              key={index}
            />
          ))}
        </Rating>
        <p>{comment.content}</p>
      </div>
    </div>
  );
};

export default CommentContentBody;
