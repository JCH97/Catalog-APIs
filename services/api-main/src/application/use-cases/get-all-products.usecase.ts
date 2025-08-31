import {Result} from '../../shared/result/result.js';
import type {IProductRepository} from '../../domain/interfaces/repositories.interface.js';

export class GetAllProductsUsecase {
    constructor(private readonly repo: IProductRepository) {
    }

    async execute() {
        const items = await this.repo.findAll();
        return Result.Ok(items);
    }
}
