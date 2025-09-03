// Elasticsearch-backed repository for searching and indexing products.
import {getElasticClient} from '../persistence/elastic.js';
import {Product} from '../../domain/entities/product.js';

/**
 * Factory function to create a search and index repository.
 * @param {string} elasticUrl - The Elasticsearch connection URL.
 * @returns {{
 *   search: (query: string) => Promise<Product[]>,
 *   index: (product: Product) => Promise<void>
 * }} The repository with search and index methods.
 */
export function productSearchRepository(elasticUrl) {
    return {
        /**
         * Searches for products by query string.
         * @param {string} query - The search query string.
         * @returns {Promise<Product[]>} Promise resolving to an array of products.
         */
        async search(query) {
            const es = await getElasticClient(elasticUrl);
            const response = await es.search({
                index: 'products',
                body: {
                    query: {
                        multi_match: {
                            query,
                            fields: ['name^3', 'description', 'brand', 'manufacturer'],
                            fuzziness: 'auto'
                        }
                    }
                }
            });
            const hits = response.body?.hits?.hits || [];
            return hits.map((hit) => Product.hydrate(hit._source).unwrap());
        },
        /**
         * Indexes a product.
         * @param {Product} product - The product to index.
         * @returns {Promise<void>} Promise that resolves when indexing is complete.
         */
        async index(product) {
            const es = await getElasticClient(elasticUrl);
            const body = product.toPrimitives();
            await es.index({ index: 'products', id: product.id, body, refresh: 'wait_for' });
        }
    };
}
