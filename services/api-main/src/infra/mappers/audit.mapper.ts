import {AuditEntity} from "../../domain/entities/audit.entity.js";
import {AuditDto} from "../../application/dtos/audit.dtos.js";

export class AuditMapper {
    public static domainToPersistence(a: AuditEntity): any {
        return a.toPrimitives();
    }

    public static persistenceToDomain(raw: any): AuditEntity {
        return AuditEntity.hydrate(raw).unwrap();
    }

    public static domainToDto(p: AuditEntity): AuditDto {
        const d = p.toPrimitives();
        return {
            productId: d.productId,
            action: d.action,
            changedAt: d.changedAt,
            changedByRole: d.changedByRole,
            changes: d.changes,
            version: d.version,
        };
    }
}
