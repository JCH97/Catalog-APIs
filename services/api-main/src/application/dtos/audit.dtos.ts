import {AuditAction} from "../../domain/enums/audit.action.enum";
import {Role} from "../../domain/enums/role";
import {AuditChangeItem} from "../../domain/interfaces/changes-items.interface";

export  type AuditDto = {
    productId: string;
    action: AuditAction;
    changedAt: Date;
    changedByRole: Role | 'SYSTEM';
    changes: AuditChangeItem[];
    version: number;
}
