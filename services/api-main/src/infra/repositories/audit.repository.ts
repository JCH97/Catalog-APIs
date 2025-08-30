import {AuditModel} from '../persistence/mongoose.models';
import type {IAuditRepository} from '../../domain/interfaces/repositories.interface';
import {AuditMapper} from "../mappers/audit.mapper";

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

