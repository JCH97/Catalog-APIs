// Redis subscriber that listens to domain events and indexes products into Elasticsearch.
import {createClient} from 'redis';
import {productSearchRepository} from '../repositories/product.search.repository.js';
import {Product} from '../../domain/entities/product.js';
import {IndexProductUseCase} from '../../application/use-cases/index-product.usecase.js';

/**
 * Starts a Redis subscriber that listens for domain events and indexes products.
 * @param {string} redisUrl
 * @param {string} elasticUrl
 */
export async function startSubscriber(redisUrl, elasticUrl) {
    const client = createClient({url: redisUrl});
    client.on('error', (err) => console.error('Redis error', err));

    await client.connect();

    const repo = productSearchRepository(elasticUrl);
    const indexUseCase = new IndexProductUseCase(repo);

    await client.subscribe('domain-events', async (message) => {
        try {
            const event = JSON.parse(message);

            const {type, payload} = event;

            console.log(`New event received. ${type}: ${JSON.stringify(payload)}`);

            if (['product.created', 'product.updated', 'product.approved'].includes(type)) {
                const product = Product.hydrate(payload).unwrap();
                await indexUseCase.execute(product);
            }
        } catch (err) {
            console.error('Failed to handle domain event', err);
        }
    });

    console.log('Redis subscriber started');
    return client;
}
