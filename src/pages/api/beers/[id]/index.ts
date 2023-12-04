import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { z } from 'zod';

import getCurrentUser from '@/config/nextConnect/middleware/getCurrentUser';
import validateRequest from '@/config/nextConnect/middleware/validateRequest';
import NextConnectOptions from '@/config/nextConnect/NextConnectOptions';

import { EditBeerPostRequest } from '@/controllers/beerPosts/types';
import {
  checkIfBeerPostOwner,
  editBeerPost,
  deleteBeerPost,
} from '@/controllers/beerPosts';

import EditBeerPostValidationSchema from '@/services/BeerPost/schema/EditBeerPostValidationSchema';

import APIResponseValidationSchema from '@/validation/APIResponseValidationSchema';

const router = createRouter<
  EditBeerPostRequest,
  NextApiResponse<z.infer<typeof APIResponseValidationSchema>>
>();

router
  .put(
    validateRequest({
      bodySchema: EditBeerPostValidationSchema,
      querySchema: z.object({ id: z.string() }),
    }),
    getCurrentUser,
    checkIfBeerPostOwner,
    editBeerPost,
  )
  .delete(
    validateRequest({ querySchema: z.object({ id: z.string() }) }),
    getCurrentUser,
    checkIfBeerPostOwner,
    deleteBeerPost,
  );

const handler = router.handler(NextConnectOptions);

export default handler;
