import passportJwt, { ExtractJwt } from 'passport-jwt';
import { Job } from '@src/core/utils/job';
import logger from '@src/utils/logger';

const JwtStrategy = passportJwt.Strategy;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: `${process.env.ACCESS_TOKEN_SECRET}`,
};

export const jwtAuth = new JwtStrategy(opts, async (jwt_payload, done) => {
  // find the user in the database based on the sub claim in the JWT
  const { data, error } = await test(
    new Job({
      action: 'findById',
      id: jwt_payload.userId,
    }),
  );

  if (error) {
    return done(error, false);
  } else if (data) {
    return done(null, data);
  } else {
    return done(null, false);
  }
});

async function test(job: Job) {
  try {
    logger.info(job);
    return { data: 'test' };
  } catch (error) {
    return { error };
  }
}
