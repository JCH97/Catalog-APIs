import { createClient } from 'redis';

/**
 * Functions for creating Redis publisher and subscriber clients.
 * - createRedisPublisher: Creates a Redis client for publishing messages.
 * - createRedisSubscriber: Creates a Redis client for subscribing to messages and handling them.
 */

export async function createRedisPublisher(url: string): Promise<any> {
  const client = createClient({ url });

  client.on('error', (err: any) => console.error('Redis Client Error', err));

  await client.connect();
  return client;
}

export async function createRedisSubscriber(url: string, handler: (channel: string, message: string) => void): Promise<any> {
  const subscriber = createClient({ url });

  subscriber.on('error', (err: any) => console.error('Redis Subscriber Error', err));

  await subscriber.connect();
  await subscriber.subscribe('domain-events', handler);

  return subscriber;
}
