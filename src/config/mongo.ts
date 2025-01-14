import { connect } from 'mongoose';
import 'dotenv/config';
import logger from '@src/utils/logger';

const mongoConnection = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    // Ensure MONGO_URI exists in the environment variables
    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }

    // Connect to MongoDB using the URI from environment variables
    await connect(mongoURI);
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process with failure status
  }
};

export default mongoConnection;
