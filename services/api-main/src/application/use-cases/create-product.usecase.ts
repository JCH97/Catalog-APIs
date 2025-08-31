import {Result} from '../../shared/result/result.js';
import {AppError} from '../../shared/errors.js';
import {ProductEntity} from '../../domain/entities/product.entity.js';
import type {IAuditRepository, IProductRepository} from '../../domain/interfaces/repositories.interface.js';
import {Role} from '../../domain/enums/role.js';
import {CreateProductInputDto} from "../dtos/product.dtos.js";
import {IPublisher} from "../../domain/interfaces/publisher.interface.js";


export class CreateProductUseCase {
    constructor(
        private readonly repo: IProductRepository,
        private readonly auditRepo: IAuditRepository,
        private readonly publisher: IPublisher
    ) {
    }

    async execute(input: CreateProductInputDto, actor: Role) {
        try {
            const product = ProductEntity.create(input, actor);

            if (product.isFailure)
                return Result.Fail(AppError.Validation(product.unwrapError().message || 'Failed to create product'));

            await this.repo.save(product.unwrap());

            await this.publisher.publish('domain-events', JSON.stringify({
                type: 'product.created',
                payload: product.unwrap().toPrimitives(),
            }));

            return product

        } catch (e: any) {
            return Result.Fail(AppError.Validation(e?.message || 'Failed to create product'));
        }
    }
}
