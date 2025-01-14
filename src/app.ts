import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import hpp from 'hpp';
import passport from 'passport';
import chalk from 'chalk';
import moment from 'moment-timezone';
import compression from 'compression';

import { jwtAuth } from '@src/modules/sql/auth/jwt/jwt.strategy';
import { localAuth } from '@src/modules/sql/auth/local/local.strategy';
import routes from '@src/routes/index.routes';

import sequelizeConnection from '@src/config/sql';
import mongoConnection from '@src/config/mongo';
import redisClient from '@src/config/redis';
import rateLimiterConfig from './config/rateLimit';
import logger from './utils/logger';

const envFile = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env';
dotenv.config({ path: envFile });

const app: Express = express();
const port = process.env.PORT ?? 3001;

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(hpp());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(passport.initialize());
app.use(rateLimiterConfig);

passport.use(jwtAuth);
passport.use(localAuth);

app.disable('x-powered-by');
app.use(routes);

app.get('/', (req: Request, res: Response) => {
  logger.info('request received', req.body);

  res.send('Express + TypeScript Server');
});

const start = async (): Promise<void> => {
  try {
    await Promise.all([
      sequelizeConnection.sync(),
      mongoConnection(),
      redisClient.connect(),
    ]);

    // Log successful connections
    logger.info(
      chalk.bgBlue.bold.italic(
        `SQL Connected:- ${moment().utc().format('YYYY-MM-DD HH:mm:ss')}`,
      ),
    );
    logger.info(
      chalk.bgGreen.bold.italic(
        `MongoDB Connected:- ${moment().utc().format('YYYY-MM-DD HH:mm:ss')}`,
      ),
    );
    logger.info(
      chalk.bgRed.bold.italic(
        `Redis Connected :- ${moment().utc().format('YYYY-MM-DD HH:mm:ss')}`,
      ),
    );

    // Start the server after all connections are established
    app.listen(port, () => {
      logger.info(`Server running on port ${port} ⚡`);
    });
  } catch (error) {
    logger.error('Error during startup:', error);
    process.exit(1);
  }
};

void start();

/* 

Run the Scripts
Start in Development Mode:

bash
Copy code
npm run dev
Build for Production:

bash
Copy code
npm run build
Start in Production Mode:

bash
Copy code
npm run start
Run ESLint:

bash
Copy code
npm run lint
Format Code with Prettier:

bash
Copy code
npm run format
Run Tests:

bash
Copy code
npm run test
*/
