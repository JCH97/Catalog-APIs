import {AuditAction} from "../../domain/enums/audit.action.enum.js";
import {Role} from "../../domain/enums/role.js";
import {AuditChangeItem} from "../../domain/interfaces/changes-items.interface.js";

export  type AuditDto = {
    productId: string;
    action: AuditAction;
    changedAt: Date;
    changedByRole: Role | 'SYSTEM';
    changes: AuditChangeItem[];
    version: number;
}
