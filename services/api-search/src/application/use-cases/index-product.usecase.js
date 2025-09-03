import {Result} from '../../shared/result/result.js';
import {AppError} from '../../shared/errors.js';

/**
 * Use case for indexing a product into the search index.
 * @class
 */
export class IndexProductUseCase {
    /**
     * @constructor
     * @param {IndexRepository} indexRepo - The repository used to index products.
     */
    constructor(indexRepo) {
        this.indexRepo = indexRepo;
    }

    /**
     * Indexes a product.
     * @param {Product} product - The product to index.
     * @returns {Promise<Result<void, AppError>>} Result of the operation.
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
