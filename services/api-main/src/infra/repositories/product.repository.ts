import {ProductModel} from '../persistence/mongoose.models.js';
import type {IProductRepository} from '../../domain/interfaces/repositories.interface.js';
import {ProductMapper} from "../mappers/product.mapper.js";
import {ObjectId} from "mongodb";

export const ProductRepository = (): IProductRepository => ({

    async findAll() {
        const docs = await ProductModel.find().lean();
        return docs.map(ProductMapper.persistenceToDomain);
    },

    async findById(id: string) {
        const doc = await ProductModel.findOne({_id: new ObjectId(id)}).lean();
        return doc ? ProductMapper.persistenceToDomain(doc) : null;
    },

    async save(entry) {
        const doc: any = entry.toPrimitives();
        await new ProductModel(doc).save();
    },

    async update(p) {
        const data = p.toPrimitives();
        await ProductModel.updateOne({_id: new ObjectId(data._id)}, {$set: data});
    },
});
