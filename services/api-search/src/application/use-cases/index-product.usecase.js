import {Result} from '../../shared/result/result.js';
import {AppError} from '../../shared/errors.js';

/**
 * @typedef {import('../../domain/interfaces/repositories.js').IndexRepository} IndexRepository
 * @typedef {import('../../domain/entities/product.js').Product} Product
 */

export class IndexProductUseCase {
    /**
     * @param {IndexRepository} indexRepo
     */
    constructor(indexRepo) {
        this.indexRepo = indexRepo;
    }

    /**
     * Indexes a product.
     * @param {Product} product
     */
    async execute(product) {
        try {
            await this.indexRepo.index(product);
            return Result.Ok();
        } catch (err) {
            console.error('Indexing failed: ' + err.message);
            return Result.Fail(AppError.Internal(err?.message || 'Indexing failed'));
        }
    }
}
