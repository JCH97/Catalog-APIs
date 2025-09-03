import {Result} from '../../shared/result/result.js';
import {AppError} from '../../shared/errors.js';
import {AuditEntity} from '../../domain/entities/audit.entity.js';
import {AuditAction} from '../../domain/enums/audit.action.enum.js';
import type {IAuditRepository, IProductRepository} from '../../domain/interfaces/repositories.interface.js';
import {Role} from '../../domain/enums/role.js';
import {IPublisher} from "../../domain/interfaces/publisher.interface.js";


/**
 * @class ApproveProductUseCase
 * @description Use case for approving a product.
 */
export class ApproveProductUseCase {
    /**
     * @constructor
     * @param {IProductRepository} repo - The product repository.
     * @param {IAuditRepository} auditRepo - The audit repository.
     * @param {IPublisher} publisher - The publisher.
     */
    constructor(
        private readonly repo: IProductRepository,
        private readonly auditRepo: IAuditRepository,
        private readonly publisher: IPublisher
    ) {
    }

    /**
     * @method execute
     * @description Executes the use case.
     * @param {string} id - The ID of the product to approve.
     * @param {Role} actor - The actor performing the action.
     * @returns {Promise<Result<ProductEntity>>} The result of the use case.
     */
    async execute(id: string, actor: Role) {
        try {
            const p = await this.repo.findById(id);
            if (!p) return Result.Fail(AppError.NotFound('Product not found'));

            const beforeSnapshot = p.toPrimitives();

            p.approve(actor);

            await this.repo.update(p);
            await this.auditRepo.add(AuditEntity.create({
                productId: p.plainId,
                action: AuditAction.APPROVED,
                changedAt: p.updatedAt,
                changedByRole: Role.EDITOR,
                changes: [{field: 'status', before: 'PENDING_REVIEW', after: 'PUBLISHED'}],
                version: p.version,
                productBeforeSnapshot: beforeSnapshot,
                productAfterSnapshot: p.toPrimitives()
            }).unwrap());

            await this.publisher.publish('domain-events', JSON.stringify({
                type: 'product.approved',
                payload: p.toPrimitives(),
            }));

            return Result.Ok(p);
        } catch (e: any) {
            return Result.Fail(AppError.Validation(e?.message || 'Failed to approve product'));
        }
    }
}
