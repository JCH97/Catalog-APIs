// Optionally load environment variables from .env. Disabled to avoid dependency on dotenv.
import {startServer} from './presentation/rest/server.js';
import {startSubscriber} from './infra/messaging/redis.subscriber.js';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const elasticUrl = process.env.ELASTIC_URL || 'http://localhost:9200';

async function main() {
    // Start the Redis subscriber first to ensure index receives events.
    await startSubscriber(redisUrl, elasticUrl);

    // Start the REST server.
    await startServer(elasticUrl);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
