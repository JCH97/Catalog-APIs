import {ProductModel} from '../persistence/mongoose.models';
import DataLoader from 'dataloader';
import {ObjectId} from "mongodb";
import {ProductMapper} from "../mappers/product.mapper";

export function createProductByIdLoader() {
    return new DataLoader<string, any>(async (ids) => {
        const docs = await ProductModel
            .find({_id: {$in: ids.map(i => new ObjectId(i))}})
            .lean();

        const map = new Map<string, any>();
        for (const doc of docs)
            map.set(doc._id.toString(), doc);

        return ids
            .map((id) => {
                let p = map.get(id);
                return p ? ProductMapper.persistenceToDomain(p) : null
            });
    });
}
