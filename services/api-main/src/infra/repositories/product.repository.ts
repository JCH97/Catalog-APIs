import {ProductModel} from '../persistence/mongoose.models';
import type {IProductRepository} from '../../domain/interfaces/repositories.interface';
import {ProductMapper} from "../mappers/product.mapper";

export const ProductRepository = (): IProductRepository => ({

    async findAll() {
        const docs = await ProductModel.find().lean();
        return docs.map(ProductMapper.persistenceToDomain);
    },

    async findById(id: string) {
        const doc = await ProductModel.findOne({id}).lean();
        return doc ? ProductMapper.persistenceToDomain(doc) : null;
    },

    async save(entry) {
        const doc: any = entry.toPrimitives ? entry.toPrimitives() : entry;
        await new ProductModel(doc).save();
    },

    async update(p) {
        const data = p.toPrimitives();
        await ProductModel.updateOne({id: data.id}, {$set: data});
    },
});
