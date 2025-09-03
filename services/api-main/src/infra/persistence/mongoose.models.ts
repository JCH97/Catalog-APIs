import mongoose, {Schema} from 'mongoose';

/**
 * Defines the Mongoose schemas for the application.
 * - NetWeightSchema: Represents the net weight of a product.
 * - ProductSchema: Represents the structure of a product document in MongoDB.
 */

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

/**
 * ChangeItemSchema: Represents a schema for tracking changes made to a product.
 * - field: The name of the field that was changed.
 * - before: The value of the field before the change.
 * - after: The value of the field after the change.
 */

const ChangeItemSchema = new Schema({
    field: String,
    before: Schema.Types.Mixed,
    after: Schema.Types.Mixed,
}, {_id: false});

/**
 * AuditSchema: Represents the structure of an audit document in MongoDB.
 * - productId: The ID of the product associated with the audit.
 * - action: The action performed
 * - changedAt: The timestamp when the change occurred.
 * - changedByRole: The role of the user who made the change.
 * - changes: An array of changes made to the product.
 * - version: The version of the product after the change.
 * - productBeforeSnapshot: A snapshot of the product before the change.
 * - productAfterSnapshot: A snapshot of the product after the change.
 */

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
