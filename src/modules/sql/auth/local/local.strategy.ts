import passportLocal from 'passport-local';

import { Job } from '@src/core/utils/job';
import { UserService } from '@src/modules/sql/users/users.service';
import { User } from '@src/modules/sql/users/entities/user.model';
import { compareHash } from '@src/core/utils/helpers';
import logger from '@src/utils/logger';

const LocalStrategy = passportLocal.Strategy;
const userService = new UserService(User);

export const localAuth = new LocalStrategy(async (username, password, done) => {
  try {
    logger.info('Username: ', username);
    logger.info('Password: ', password);
    logger.info('Done: ', done);
    const { data } = await userService.findOne(
      new Job({
        action: 'findOne',
        options: {
          where: {
            email: username,
          },
        },
      }),
    );

    logger.info('Data: ', data);
    // User not found
    if (!data) {
      console.warn(`Login attempt failed for username: ${username}`);
      return done(null, false, { message: 'Invalid username or password.' });
    }

    const isPasswordValid = await compareHash(password, data.password);

    if (!isPasswordValid) {
      console.warn(`Invalid password attempt for username:: ${username}`);
      return done(null, false, { message: 'Invalid username or password..' });
    }

    // User authentication successful
    logger.info(`User authenticated successfully: ${username}`);
    return done(null, data);
  } catch (error) {
    logger.error('Unexpected error during authentication:', error);
    return done(error);
  }
});
