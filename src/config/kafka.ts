const kafkaConfig = {
  clientId: process.env.KAFKA_CLIENT_ID ?? 'my-app',
  brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
  groupId: process.env.KAFKA_GROUP_ID ?? 'my-group',
  topic: process.env.KAFKA_TOPIC ?? 'my-topic',
};

export default kafkaConfig;
