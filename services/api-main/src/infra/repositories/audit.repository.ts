import {AuditModel} from '../persistence/mongoose.models.js';
import type {IAuditRepository} from '../../domain/interfaces/repositories.interface.js';
import {AuditMapper} from "../mappers/audit.mapper.js";

export const auditRepository = (): IAuditRepository => ({

    async add(entry) {
        const doc: any = entry.toPrimitives();
        await new AuditModel(doc).save();
    },

    async findByProductId(productId: string) {
        const docs = await AuditModel.find({productId}).lean();
        return docs.map(d => AuditMapper.persistenceToDomain(d));
    },
});

