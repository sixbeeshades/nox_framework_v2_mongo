import { Kafka, KafkaConfig } from 'kafkajs';


export class KafkaClient {
    private readonly kafka: Kafka;

    constructor(config: KafkaConfig) {
        this.kafka = new Kafka(config);
    }

    getProducer() {
        return this.kafka.producer();
    }

    getConsumer(groupId: string) {
        return this.kafka.consumer({ groupId });
    }
}

