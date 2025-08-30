import { ProductModel } from '../persistence/mongoose.models';
import DataLoader from 'dataloader';

export function createProductByIdLoader() {
  return new DataLoader<string, any>(async (ids) => {
    const docs = await ProductModel.find({ id: { $in: ids } }).lean();
    const map = new Map<string, any>();
    for (const doc of docs) {
      map.set(doc.id, doc);
    }
    return ids.map((id) => map.get(id) ?? null);
  });
}
