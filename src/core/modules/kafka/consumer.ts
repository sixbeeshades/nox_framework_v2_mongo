import { Consumer as KafkaConsumer, EachMessagePayload } from 'kafkajs';
import { KafkaClient } from './kafka.client';
import logger from '@src/utils/logger';

class Consumer {
  private readonly consumer: KafkaConsumer;

  constructor(kafkaClient: KafkaClient, groupId: string) {
    this.consumer = kafkaClient.getConsumer(groupId);
  }

  /**
   * Connects the Kafka consumer to the specified topic. If the consumer is not
   * already connected, it will connect to the Kafka cluster and subscribe to
   * the specified topic, starting from the beginning of the topic's data.
   *
   * @param topic - The name of the topic to subscribe to
   */
  async connect(topic: string) {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic, fromBeginning: true });
    logger.info(`Kafka Consumer connected to topic "${topic}"`);
  }

  async runMessageHandler(
    handler: (payload: EachMessagePayload) => Promise<void>,
  /**
   * Runs a message handler function for each message received from the Kafka
   * cluster. The message handler function is passed the message payload as an
   * argument.
   *
   * @param handler - The message handler function. This function should return a
   * Promise that resolves when the message has been successfully handled.
   */
  ) {
    await this.consumer.run({
      eachMessage: async (payload) => {
        await handler(payload);
      },
    });
  }


  /**
   * Disconnects the Kafka consumer from the Kafka cluster. This method will 
   * stop the consumer from receiving any more messages and clean up resources 
   * associated with the connection.
   */

  async disconnect() {
    await this.consumer.disconnect();
    logger.info('Kafka Consumer disconnected');
  }
}

export default Consumer;
