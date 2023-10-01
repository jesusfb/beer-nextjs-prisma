import validateRequest from '@/config/nextConnect/middleware/validateRequest';
import DBClient from '@/prisma/DBClient';
import getAllBeerStyles from '@/services/BeerStyles/getAllBeerStyles';
import PaginatedQueryResponseSchema from '@/services/schema/PaginatedQueryResponseSchema';

import APIResponseValidationSchema from '@/validation/APIResponseValidationSchema';
import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { z } from 'zod';

interface GetBeerStylesRequest extends NextApiRequest {
  query: z.infer<typeof PaginatedQueryResponseSchema>;
}

const getBeerStyles = async (
  req: GetBeerStylesRequest,
  res: NextApiResponse<z.infer<typeof APIResponseValidationSchema>>,
) => {
  const pageNum = parseInt(req.query.page_num, 10);
  const pageSize = parseInt(req.query.page_size, 10);

  const beerStyles = await getAllBeerStyles({ pageNum, pageSize });
  const beerStyleCount = await DBClient.instance.beerStyle.count();

  res.setHeader('X-Total-Count', beerStyleCount);

  res.status(200).json({
    message: 'Beer types retrieved successfully',
    statusCode: 200,
    payload: beerStyles,
    success: true,
  });
};

const router = createRouter<
  GetBeerStylesRequest,
  NextApiResponse<z.infer<typeof APIResponseValidationSchema>>
>();

router.get(
  validateRequest({
    querySchema: PaginatedQueryResponseSchema,
  }),
  getBeerStyles,
);

const handler = router.handler();

export default handler;
