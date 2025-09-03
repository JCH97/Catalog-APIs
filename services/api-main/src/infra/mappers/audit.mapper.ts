import {AuditEntity} from "../../domain/entities/audit.entity.js";
import {AuditDto} from "../../application/dtos/audit.dtos.js";

/**
 * Mapper class for transforming audit data between different layers.
 * - domainToPersistence: Converts a domain entity to a persistence format.
 * - persistenceToDomain: Converts raw persistence data to a domain entity.
 * - domainToDto: Converts a domain entity to a Data Transfer Object (DTO).
 */
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
