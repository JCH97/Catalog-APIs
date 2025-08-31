// Use case for searching products in the search service.
import { Result } from '../../shared/result/result.js';
import { AppError } from '../../shared/errors.js';

/**
 * @typedef {import('../../domain/interfaces/repositories.js').SearchRepository} SearchRepository
 */

export class SearchProductsUseCase {
  /**
   * @param {SearchRepository} searchRepo
   */
  constructor(searchRepo) {
    this.searchRepo = searchRepo;
  }

  /**
   * Executes a search for products.
   * @param {string} query
   */
  async execute(query) {
    try {
      if (!query) return Result.Ok([]);
      const items = await this.searchRepo.search(query);
      return Result.Ok(items);
    } catch (err) {
      return Result.Fail(AppError.Internal(err?.message || 'Search failed'));
    }
  }
}