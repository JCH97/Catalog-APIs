// Use case for searching products in the search service.
import { Result } from '../../shared/result/result.js';
import { AppError } from '../../shared/errors.js';

/**
 * Use case for searching products in the search index.
 * @class
 */
export class SearchProductsUseCase {
  /**
   * @constructor
   * @param {SearchRepository} searchRepo - The repository used to search products.
   */
  constructor(searchRepo) {
    this.searchRepo = searchRepo;
  }

  /**
   * Executes a search for products.
   * @param {string} query - The search query string.
   * @returns {Promise<Result<Product[], AppError>>} Result containing found products or error.
   */
  async execute(query) {
    try {
      if (!query) return Result.Ok([]);
      const items = await this.searchRepo.search(query);
      return Result.Ok(items);
    } catch (err) {
      console.error(err);
      return Result.Fail(AppError.Internal(err?.message || 'Search failed'));
    }
  }
}
