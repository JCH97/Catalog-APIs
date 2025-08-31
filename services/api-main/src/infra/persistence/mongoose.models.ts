import mongoose, {Schema} from 'mongoose';

const NetWeightSchema = new Schema({
    value: {type: Number},
    unit: {type: String},
}, {_id: false});

const ProductSchema = new Schema({
    gtin: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    description: {type: String},
    brand: {type: String},
    manufacturer: {type: String},
    netWeight: {type: NetWeightSchema},
    status: {type: String, required: true},
    createdByRole: {type: String, required: true},
    createdAt: {type: Date, required: true},
    updatedAt: {type: Date, required: true},
    version: {type: Number, required: true},
}, {versionKey: false});

const ChangeItemSchema = new Schema({
    field: String,
    before: Schema.Types.Mixed,
    after: Schema.Types.Mixed,
}, {_id: false});

const AuditSchema = new Schema({
    productId: {type: String, index: true},
    action: {type: String, required: true},
    changedAt: {type: Date, required: true},
    changedByRole: {type: String, required: true},
    changes: [ChangeItemSchema],
    version: {type: Number, required: true},
    productBeforeSnapshot: {type: Schema.Types.Mixed},
    productAfterSnapshot: {type: Schema.Types.Mixed},
}, {versionKey: false});

export const ProductModel = mongoose.model('Product', ProductSchema);
export const AuditModel = mongoose.model('Audit', AuditSchema);
