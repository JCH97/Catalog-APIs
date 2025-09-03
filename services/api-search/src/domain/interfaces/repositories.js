// Domain interfaces for the search service.

/**
 * @typedef {import('../entities/product.js').Product} Product
 */

/**
 * Interface for searching products.
 * @interface
 */
export class SearchRepository {
  /**
   * Performs a search query and returns matching products.
   * @param {string} query - The search query string.
   * @returns {Promise<Product[]>} Promise resolving to an array of products.
   */
  search(query) {
    throw new Error('Not implemented');
  }
}

/**
 * Interface for indexing products.
 * @interface
 */
export class IndexRepository {
  /**
   * Indexes a product into the search index.
   * @param {Product} product - The product to index.
   * @returns {Promise<void>} Promise that resolves when indexing is complete.
   */
  index(product) {
    throw new Error('Not implemented');
  }
}
