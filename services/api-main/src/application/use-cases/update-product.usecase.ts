import {Result} from '../../shared/result/result.js';
import {AppError} from '../../shared/errors.js';
import {AuditEntity} from '../../domain/entities/audit.entity';
import {AuditAction} from '../../domain/enums/audit.action.enum';
import type {IAuditRepository, IProductRepository} from '../../domain/interfaces/repositories.interface';
import {Role} from '../../domain/enums/role';
import {IPublisher} from "../../domain/interfaces/publisher.interface";
import {UpdateProductInputDTO} from "../dtos/product.dtos";


export class UpdateProductUseCase {
    constructor(
        private readonly repo: IProductRepository,
        private readonly auditRepo: IAuditRepository,
        private readonly publisher: IPublisher
    ) {
    }

    async execute(id: string, patch: UpdateProductInputDTO, actor: Role) {
        try {
            const p = await this.repo.findById(id);
            if (!p) return Result.Fail(AppError.NotFound('Product not found'));

            const beforeSnapshot = p.toPrimitives();

            const wasOk = p.update(patch, actor);
            if (wasOk.isFailure)
                return Result.Fail(AppError.Validation(wasOk.unwrapError().message));

            if (p.version === beforeSnapshot.version)
                return Result.Ok(p);


            await this.repo.update(p);

            const fields: (keyof typeof beforeSnapshot)[] = ['name', 'description', 'brand', 'manufacturer', 'netWeight'];
            const changes: any[] = [];
            for (const f of fields) {
                const a = (p.toPrimitives() as any)[f];
                const b = (beforeSnapshot as any)[f];
                if (JSON.stringify(a) !== JSON.stringify(b)) {
                    changes.push({field: String(f), before: b, after: a});
                }
            }
            await this.auditRepo.add(AuditEntity.create({
                productId: p.plainId,
                action: AuditAction.UPDATED,
                changedAt: p.updatedAt,
                changedByRole: actor,
                changes,
                version: p.version,
                productBeforeSnapshot: beforeSnapshot,
                productAfterSnapshot: p.toPrimitives(),
            }).unwrap());

            await this.publisher.publish('domain-events', JSON.stringify({
                type: 'product.updated',
                payload: p.toPrimitives(),
            }));

            return Result.Ok(p);
        } catch (e: any) {
            return Result.Fail(AppError.Validation(e?.message || 'Failed to update product'));
        }
    }
}
