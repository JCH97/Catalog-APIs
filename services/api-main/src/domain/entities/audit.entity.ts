import {Role} from '../enums/role.js';
import {AuditAction} from '../enums/audit.action.enum.js';
import {AuditChangeItem} from "../interfaces/changes-items.interface.js";
import {Result} from "../../shared/result/result.js";
import {AppError} from "../../shared/errors.js";

/**
 * @type AuditProps
 * @description Represents the properties of an audit entry.
 */
export type AuditProps = {
    productId: string;
    action: AuditAction;
    changedAt: Date;
    changedByRole: Role | 'SYSTEM';
    changes: AuditChangeItem[];
    version: number;
    productBeforeSnapshot?: object;
    productAfterSnapshot?: object;
};

/**
 * @class AuditEntity
 * @description Represents an audit entity.
 */
export class AuditEntity {
    /**
     * @constructor
     * @param {AuditProps} props - The properties of the audit entry.
     */
    private constructor(private readonly props: AuditProps) {
    }

    /**
     * @method create
     * @description Creates a new audit entity.
     * @param {AuditProps} props - The properties for creating the audit entry.
     * @returns {Result<AuditEntity>} The result of the creation.
     */
    static create(props: AuditProps): Result<AuditEntity> {
        if (!props.productId)
            return Result.Fail(AppError.Validation('AuditEntry requiere productId'));

        return Result.Ok(new AuditEntity({...props, changedAt: new Date()}));
    }

    /**
     * @method hydrate
     * @description Creates an audit entity from existing data.
     * @param {AuditProps} data - The data to hydrate the entity with.
     * @returns {Result<AuditEntity>} The result of the hydration.
     */
    static hydrate(data: AuditProps): Result<AuditEntity> {
        return Result.Ok(new AuditEntity({
            ...data,
        }));
    }

    /**
     * @method toPrimitives
     * @description Converts the entity to its primitive properties.
     * @returns {AuditProps} The primitive properties of the entity.
     */
    toPrimitives(): AuditProps {
        return {...this.props};
    }
}
