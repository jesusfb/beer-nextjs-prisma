import getCurrentUser from '@/config/nextConnect/middleware/getCurrentUser';
import getBeerPostById from '@/services/BeerPost/getBeerPostById';
import { UserExtendedNextApiRequest } from '@/config/auth/types';
import NextConnectOptions from '@/config/nextConnect/NextConnectOptions';
import editBeerPostById from '@/services/BeerPost/editBeerPostById';
import EditBeerPostValidationSchema from '@/services/BeerPost/schema/EditBeerPostValidationSchema';
import APIResponseValidationSchema from '@/validation/APIResponseValidationSchema';
import { NextApiResponse } from 'next';
import { createRouter, NextHandler } from 'next-connect';
import { z } from 'zod';
import ServerError from '@/config/util/ServerError';
import DBClient from '@/prisma/DBClient';

interface BeerPostRequest extends UserExtendedNextApiRequest {
  query: { id: string };
}

interface EditBeerPostRequest extends BeerPostRequest {
  body: z.infer<typeof EditBeerPostValidationSchema>;
}

const checkIfBeerPostOwner = async (
  req: BeerPostRequest,
  res: NextApiResponse,
  next: NextHandler,
) => {
  const { user, query } = req;
  const { id } = query;

  const beerPost = await getBeerPostById(id);

  if (!beerPost) {
    throw new ServerError('Beer post not found', 404);
  }

  if (beerPost.postedBy.id !== user!.id) {
    throw new ServerError('You cannot edit that beer post.', 403);
  }

  next();
};

const editBeerPost = async (
  req: EditBeerPostRequest,
  res: NextApiResponse<z.infer<typeof APIResponseValidationSchema>>,
) => {
  const {
    body,
    query: { id },
  } = req;

  await editBeerPostById(id, body);

  res.status(200).json({
    message: 'Beer post updated successfully',
    success: true,
    statusCode: 200,
  });
};

const deleteBeerPost = async (req: BeerPostRequest, res: NextApiResponse) => {
  const {
    query: { id },
  } = req;

  const deleted = await DBClient.instance.beerPost.delete({
    where: { id },
  });

  if (!deleted) {
    throw new ServerError('Beer post not found', 404);
  }

  res.status(200).json({
    message: 'Beer post deleted successfully',
    success: true,
    statusCode: 200,
  });
};
const router = createRouter<
  EditBeerPostRequest,
  NextApiResponse<z.infer<typeof APIResponseValidationSchema>>
>();

router.put(getCurrentUser, checkIfBeerPostOwner, editBeerPost);
router.delete(getCurrentUser, checkIfBeerPostOwner, deleteBeerPost);

const handler = router.handler(NextConnectOptions);

export default handler;
