import { z } from 'zod';

const BeerTypeQueryResult = z.object({
  id: z.string().cuid(),
  name: z.string(),
  postedBy: z.object({
    id: z.string().cuid(),
    username: z.string(),
  }),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
});

export default BeerTypeQueryResult;
