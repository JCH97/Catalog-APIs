import {Result} from '../../shared/result/result.js';
import type {IProductRepository} from '../../domain/interfaces/repositories.interface.js';

/**
 * @class GetAllProductsUsecase
 * @description Use case for getting all products.
 */
export class GetAllProductsUsecase {
    /**
     * @constructor
     * @param {IProductRepository} repo - The product repository.
     */
    constructor(private readonly repo: IProductRepository) {
    }

    /**
     * @method execute
     * @description Executes the use case.
     * @returns {Promise<Result<ProductEntity[]>>} The result of the use case.
     */
    async execute() {
        const items = await this.repo.findAll();
        return Result.Ok(items);
    }
}
