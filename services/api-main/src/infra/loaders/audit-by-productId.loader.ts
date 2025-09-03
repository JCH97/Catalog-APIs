import {AuditModel} from '../persistence/mongoose.models.js';
import DataLoader from 'dataloader';

/**
 * Creates a DataLoader instance for batching and caching audit entries by product ID.
 * - Fetches audit entries for a list of product IDs.
 * - Groups the results by product ID.
 */
export function createAuditByProductIdLoader() {
    return new DataLoader<string, any[]>(async (productIds) => {
        const audits = await AuditModel
            .find({productId: {$in: productIds}})
            .lean();

        const byId = new Map<string, any[]>();
        for (const id of productIds) {
            byId.set(id, []);
        }

        for (const audit of audits) {
            const list = byId.get(audit.productId as string) || [];
            list.push(audit);
            byId.set(audit.productId as string, list);
        }
        return productIds.map((id) => byId.get(id) ?? []);
    });
}
