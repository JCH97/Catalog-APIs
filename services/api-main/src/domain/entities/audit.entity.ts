import {Role} from '../enums/role';
import {AuditAction} from '../enums/audit.action.enum';
import {AuditChangeItem} from "../interfaces/changes-items.interface";
import {Result} from "../../shared/result/result";
import {AppError} from "../../shared/errors";

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

export class AuditEntity {
    private constructor(private readonly props: AuditProps) {
    }

    static create(props: AuditProps): Result<AuditEntity> {
        if (!props.productId)
            return Result.Fail(AppError.Validation('AuditEntry requiere productId'));

        return Result.Ok(new AuditEntity({...props, changedAt: new Date()}));
    }

    static hydrate(data: AuditProps): Result<AuditEntity> {
        return Result.Ok(new AuditEntity({
            ...data,
        }));
    }

    toPrimitives(): AuditProps {
        return {...this.props};
    }
}
