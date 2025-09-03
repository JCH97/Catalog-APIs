// Singleton wrapper for Elasticsearch client used by the search service.
import {Client} from '@elastic/elasticsearch';

let client;

/**
 * Returns a singleton Elasticsearch client.
 * Ensures the 'products' index exists.
 * @param {string} nodeUrl - The Elasticsearch node URL.
 * @returns {Promise<Client>} The Elasticsearch client instance.
 */
export async function getElasticClient(nodeUrl) {
    console.log(`getElasticClient: ${nodeUrl}`);
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
