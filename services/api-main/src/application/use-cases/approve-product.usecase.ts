import {Result} from '../../shared/result/result.js';
import {AppError} from '../../shared/errors.js';
import {AuditEntity} from '../../domain/entities/audit.entity';
import {AuditAction} from '../../domain/enums/audit.action.enum';
import type {IAuditRepository, IProductRepository} from '../../domain/interfaces/repositories.interface';
import {Role} from '../../domain/enums/role';
import {Publisher} from "../../domain/interfaces/publisher.interface";


export class ApproveProductUseCase {
    constructor(
        private readonly repo: IProductRepository,
        private readonly auditRepo: IAuditRepository,
        private readonly publisher: Publisher
    ) {
    }

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
