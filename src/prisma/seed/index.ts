import { performance } from 'perf_hooks';

import logger from '../../config/pino/logger';

import cleanDatabase from './clean/cleanDatabase';

import createNewBeerImages from './create/createNewBeerImages';
import createNewBeerPostComments from './create/createNewBeerPostComments';
import createNewBeerPostLikes from './create/createNewBeerPostLikes';
import createNewBeerPosts from './create/createNewBeerPosts';
import createNewBeerTypes from './create/createNewBeerTypes';
import createNewBreweryImages from './create/createNewBreweryImages';
import createNewBreweryPostComments from './create/createNewBreweryPostComments';
import createNewBreweryPosts from './create/createNewBreweryPosts';
import createNewUsers from './create/createNewUsers';
import createNewBreweryPostLikes from './create/createNewBreweryPostLikes';
import createNewLocations from './create/createNewLocations';

(async () => {
  try {
    const start = performance.now();

    logger.info('Clearing database.');
    await cleanDatabase();

    logger.info('Database cleared successfully, preparing to seed.');

    const users = await createNewUsers({ numberOfUsers: 1000 });
    logger.info('Users created successfully.');
    console.log(users);

    const locations = await createNewLocations({
      numberOfLocations: 1500,
      joinData: { users },
    });
    logger.info('Locations created successfully.');

    const [breweryPosts, beerTypes] = await Promise.all([
      createNewBreweryPosts({ numberOfPosts: 1300, joinData: { users, locations } }),
      createNewBeerTypes({ joinData: { users } }),
    ]);
    logger.info('Brewery posts and beer types created successfully.');
    const beerPosts = await createNewBeerPosts({
      numberOfPosts: 200,
      joinData: { breweryPosts, beerTypes, users },
    });
    logger.info('Beer posts created successfully.');
    const [
      beerPostComments,
      breweryPostComments,
      beerPostLikes,
      beerImages,
      breweryImages,
    ] = await Promise.all([
      createNewBeerPostComments({
        numberOfComments: 45000,
        joinData: { beerPosts, users },
      }),
      createNewBreweryPostComments({
        numberOfComments: 45000,
        joinData: { breweryPosts, users },
      }),
      createNewBeerPostLikes({
        numberOfLikes: 10000,
        joinData: { beerPosts, users },
      }),
      createNewBreweryPostLikes({
        numberOfLikes: 10000,
        joinData: { breweryPosts, users },
      }),
      createNewBeerImages({
        numberOfImages: 1000,
        joinData: { beerPosts, users },
      }),
      createNewBreweryImages({
        numberOfImages: 1000,
        joinData: { breweryPosts, users },
      }),
    ]);

    logger.info(
      'Beer post comments, brewery post comments, beer post likes, beer images, and brewery images created successfully.',
    );

    const end = performance.now();
    const timeElapsed = (end - start) / 1000;

    logger.info('Database seeded successfully.');

    logger.info({
      numberOfUsers: users.length,
      numberOfBreweryPosts: breweryPosts.length,
      numberOfBeerPosts: beerPosts.length,
      numberOfBeerTypes: beerTypes.length,
      numberOfBeerPostLikes: beerPostLikes.length,
      numberOfBeerPostComments: beerPostComments.length,
      numberOfBreweryPostComments: breweryPostComments.length,
      numberOfBeerImages: beerImages.length,
      numberOfBreweryImages: breweryImages.length,
    });

    logger.info(`Database seeded in ${timeElapsed.toFixed(2)} seconds.`);

    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database.');
    logger.error(error);
    process.exit(1);
  }
})();
