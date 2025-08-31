// Singleton wrapper for Elasticsearch client used by the search service.
import {Client} from '@elastic/elasticsearch';

let client;

/**
 * Returns a singleton Elasticsearch client.
 * @param {string} nodeUrl
 */
export async function getElasticClient(nodeUrl) {
    if (!client) {
        client = new Client({node: nodeUrl});
        // ensure index exists
        const exists = await client.indices.exists({index: 'products'});
        if (!exists?.body) {
            await client.indices.create({index: 'products'});
        }
    }
    return client;
}
