import logger from '@src/utils/logger';
import { createClient } from 'redis';

const redisClient = createClient();

redisClient.on('ready', () => {
  logger.info('\x1b[32m', 'Client connected to redis and redy to use...');
});

redisClient.on('end', () => {
  logger.info('Client disconnected from redis');
});

process.on('SIGINT', () => {
  redisClient.quit();
});

redisClient.on('error', (err) => {
  logger.info('Redis client Error', err);
});

export default redisClient;
