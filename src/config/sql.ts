import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import logger from '@src/utils/logger';

// Load environment variables from .env file
dotenv.config();

// Validate environment variables
const requiredEnvVars = [
  'MYSQL_HOST',
  'MYSQL_USERNAME',
  'MYSQL_PASSWORD',
  'MYSQL_DATABASE',
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

// Create Sequelize connection instance
const sequelizeConnection = new Sequelize({
  dialect: 'mysql', // MySQL dialect
  host: process.env.MYSQL_HOST, // Database host
  username: process.env.MYSQL_USERNAME, // Database username
  password: process.env.MYSQL_PASSWORD, // Database password
  database: process.env.MYSQL_DATABASE, // Database name
  logging: false, // Disable SQL query logging
  pool: {
    max: 5, // Maximum number of connections
    min: 0, // Minimum number of connections
    acquire: 30000, // Maximum time (in ms) to wait for a connection
    idle: 10000, // Maximum time (in ms) a connection can be idle before being released
  },
});

// Test the connection
async function testConnection() {
  try {
    await sequelizeConnection.authenticate();
    logger.info('Connection has been established successfully.');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
    process.exit(1); // Exit if the connection fails
  }
}

// Call the test function
testConnection();

export default sequelizeConnection;
