import { Kafka, Producer } from 'kafkajs';

const kafka = new Kafka({ clientId: 'dev-forum', brokers: ['localhost:9092'] });
const producer: Producer = kafka.producer();

export async function emitThreadCreated(threadId: number) {
  await producer.send({
    topic: 'thread-created',
    messages: [{ value: JSON.stringify({ threadId }) }],
  });
}

export async function emitThreadDeleted(threadId: number) {
  await producer.send({
    topic: 'thread-deleted',
    messages: [{ value: JSON.stringify({ threadId }) }],
  });
}
