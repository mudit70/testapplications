import amqp from 'amqplib';

export async function publishArticleCreated(id: number) {
  const conn = await amqp.connect(process.env.AMQP_URL ?? 'amqp://localhost');
  const channel = await conn.createChannel();
  channel.publish('articles', 'article.created', Buffer.from(JSON.stringify({ id })));
}

export async function startIndexConsumer() {
  const conn = await amqp.connect(process.env.AMQP_URL ?? 'amqp://localhost');
  const channel = await conn.createChannel();
  await channel.consume('article.created', () => {});
}
