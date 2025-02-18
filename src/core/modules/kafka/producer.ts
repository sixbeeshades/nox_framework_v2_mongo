import { Producer as KafkaProducer } from 'kafkajs';
import { KafkaClient } from './kafka.client';
import logger from '@src/utils/logger';

class Producer {
  private readonly producer: KafkaProducer;

  constructor(kafkaClient: KafkaClient) {
    this.producer = kafkaClient.getProducer();
  }

  /**
   * Connects the Kafka producer to the Kafka cluster. If the producer is not
   * already connected, it will connect to the Kafka cluster and log a message
   * indicating success.
   */
  async connect() {
    await this.producer.connect();
    logger.info('Kafka producer connected');
  }

  /**
   * Sends a message to the specified topic. The message is given as an array
   * of objects with 'key' and 'value' properties. If the producer is not
   * already connected, it will connect to the Kafka cluster. If the message
   * is sent successfully, a log message will be written with the topic name.
   *
   * @param topic - The name of the topic to send the message to
   * @param messages - The message to send, given as an array of objects with
   * 'key' and 'value' properties
   */
  async sendMessage(topic: string, messages: { key: string; value: string }[]) {
    await this.producer.send({ topic, messages });
    logger.info('Message sent successfully');
  }


  /**
   * Disconnects the Kafka producer from the Kafka cluster. If the producer is not
   * already disconnected, it will disconnect from the Kafka cluster and log a
   * message indicating success.
   */
  async disconnect() {
    await this.producer.disconnect();
    logger.info('Kafka producer disconnected');
  }
}

export default Producer;
