import {Result} from '../../shared/result/result.js';
import {AppError} from '../../shared/errors.js';
import type {IProductRepository} from '../../domain/interfaces/repositories.interface.js';

/**
 * @class GetProductUseCase
 * @description Use case for getting a product by its ID.
 */
export class GetProductUseCase {
    /**
     * @constructor
     * @param {IProductRepository} repo - The product repository.
     */
    constructor(
        private readonly repo: IProductRepository) {
    }

    /**
     * @method execute
     * @description Executes the use case.
     * @param {string} id - The ID of the product to retrieve.
     * @returns {Promise<Result<ProductEntity>>} The result of the use case.
     */
    async execute(id: string) {
        const p = await this.repo.findById(id);
        return p ? Result.Ok(p) : Result.Fail(AppError.NotFound('Product not found'));
    }
}
