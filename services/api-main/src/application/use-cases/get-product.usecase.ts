import {Result} from '../../shared/result/result.js';
import {AppError} from '../../shared/errors.js';
import type {IProductRepository} from '../../domain/interfaces/repositories.interface.js';

export class GetProductUseCase {
    constructor(
        private readonly repo: IProductRepository) {
    }

    async execute(id: string) {
        const p = await this.repo.findById(id);
        return p ? Result.Ok(p) : Result.Fail(AppError.NotFound('Product not found'));
    }
}
