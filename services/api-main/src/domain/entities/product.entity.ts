import {Role} from '../enums/role.js';
import {ProductStatus} from '../enums/product-status.enum.js';
import {Result} from "../../shared/result/result.js";
import {AppError} from "../../shared/errors.js";
import {ObjectId} from "mongodb";

/**
 * @type NetWeight
 * @description Represents the net weight of a product.
 */
export type NetWeight = {
    value: number;
    unit: 'GRAM' | 'KILOGRAM' | 'OUNCE' | 'POUND';
}

/**
 * @type ProductProps
 * @description Represents the properties of a product.
 */
export type ProductProps = {
    _id: string;
    gtin: string;
    name: string;
    description?: string | null;
    brand?: string | null;
    manufacturer?: string | null;
    netWeight?: NetWeight | null;
    status: ProductStatus;
    createdByRole: Role;
    createdAt: Date;
    updatedAt: Date;
    version: number;
};

/**
 * @class ProductEntity
 * @description Represents a product entity.
 */
export class ProductEntity {
    private readonly _id: string;
    private _gtin: string;
    private _name: string;
    private _description?: string | null;
    private _brand?: string | null;
    private _manufacturer?: string | null;
    private _netWeight?: NetWeight | null;
    private _status: ProductStatus;
    private _createdByRole: Role;
    private _createdAt: Date;
    private _updatedAt: Date;
    private _version: number;

    /**
     * @constructor
     * @param {ProductProps} props - The properties of the product.
     */
    private constructor(props: ProductProps) {
        this._id = props._id;
        this._gtin = props.gtin;
        this._name = props.name;
        this._description = props.description ?? null;
        this._brand = props.brand ?? null;
        this._manufacturer = props.manufacturer ?? null;
        this._netWeight = props.netWeight ?? null;
        this._status = props.status;
        this._createdByRole = props.createdByRole;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
        this._version = props.version;
    }

    /**
     * @method create
     * @description Creates a new product entity.
     * @param {object} input - The input data for creating the product.
     * @param {Role} actor - The actor creating the product.
     * @returns {Result<ProductEntity>} The result of the creation.
     */
    static create(input: {
        gtin: string;
        name: string;
        description?: string | null;
        brand?: string | null;
        manufacturer?: string | null;
        netWeight?: NetWeight | null;
    }, actor: Role): Result<ProductEntity> {
        if (!/^[0-9]{8,14}$/.test(input.gtin))
            return Result.Fail(AppError.Validation('GTIN invalid (8 - 14 digits required)'));

        if (!input.name || input.name.trim().length < 2)
            return Result.Fail(AppError.Validation('At least 2 characters required for name'));

        if (input.netWeight)
            if (input.netWeight.value <= 0)
                return Result.Fail(AppError.Validation('Net weight must be positive'));

        const now = new Date();
        const status: ProductStatus = actor === Role.EDITOR ? ProductStatus.PUBLISHED : ProductStatus.PENDING_REVIEW;

        const p = new ProductEntity({
            _id: new ObjectId().toString(),
            gtin: input.gtin,
            name: input.name.trim(),
            description: input.description ?? null,
            brand: input.brand ?? null,
            manufacturer: input.manufacturer ?? null,
            netWeight: input.netWeight ?? null,
            status,
            createdByRole: actor,
            createdAt: now,
            updatedAt: now,
            version: 1,
        });

        return Result.Ok(p);
    }

    /**
     * @method hydrate
     * @description Creates a product entity from existing data.
     * @param {ProductProps} data - The data to hydrate the entity with.
     * @returns {Result<ProductEntity>} The result of the hydration.
     */
    static hydrate(data: ProductProps): Result<ProductEntity> {
        return Result.Ok(new ProductEntity({
            ...data,
            _id: data._id.toString(),
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt)
        }));
    }

    /**
     * @method toPrimitives
     * @description Converts the entity to its primitive properties.
     * @returns {ProductProps} The primitive properties of the entity.
     */
    toPrimitives(): ProductProps {
        return {
            _id: this._id,
            gtin: this._gtin,
            name: this._name,
            description: this._description ?? null,
            brand: this._brand ?? null,
            manufacturer: this._manufacturer ?? null,
            netWeight: this._netWeight ?? null,
            status: this._status,
            createdByRole: this._createdByRole,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
            version: this._version,
        };
    }

    /**
     * @method update
     * @description Updates the product.
     * @param {object} patch - The data to update.
     * @param {Role} actor - The actor performing the update.
     * @returns {Result<boolean>} The result of the update.
     */
    update(patch: Partial<{
        name: string;
        description: string | null;
        brand: string | null;
        manufacturer: string | null;
        netWeight: NetWeight | null
    }>, actor: Role): Result<boolean> {
        if (actor === Role.PROVIDER && this._status !== ProductStatus.PENDING_REVIEW)
            return Result.Fail(AppError.Validation('Product can only be edited by PROVIDER when in PENDING_REVIEW status'));

        let changed = false;
        const set = (key: keyof ProductProps, val: any) => {
            (this as any)[`_${key}`] = val;
            changed = true;
        };
        if (typeof patch.name === 'string' && patch.name.trim() && patch.name.trim() !== this._name) set('name', patch.name.trim());
        if (patch.description !== undefined && patch.description !== this._description) set('description', patch.description ?? null);
        if (patch.brand !== undefined && patch.brand !== this._brand) set('brand', patch.brand ?? null);
        if (patch.manufacturer !== undefined && patch.manufacturer !== this._manufacturer) set('manufacturer', patch.manufacturer ?? null);
        if (patch.netWeight) {
            if (patch.netWeight.value <= 0)
                return Result.Fail(AppError.Validation('Net weight must be a positive'));
            if (JSON.stringify(patch.netWeight) !== JSON.stringify(this._netWeight)) set('netWeight', patch.netWeight);
        }
        if (changed) {
            this._version += 1;
            this._updatedAt = new Date();
        }

        return Result.Ok(changed);
    }

    /**
     * @method approve
     * @description Approves the product.
     * @param {Role} actor - The actor approving the product.
     * @returns {Result<void>} The result of the approval.
     */
    approve(actor: Role): Result<void> {
        if (actor !== Role.EDITOR)
            return Result.Fail(AppError.Validation('You should be an EDITOR to approve a product'));

        if (this._status === ProductStatus.PUBLISHED) return Result.Ok();

        this._status = ProductStatus.PUBLISHED;
        this._version += 1;
        this._updatedAt = new Date();

        return Result.Ok();
    }

    get plainId() {
        return this._id;
    }

    get gtin() {
        return this._gtin;
    }

    get name() {
        return this._name;
    }

    get description() {
        return this._description;
    }

    get brand() {
        return this._brand;
    }

    get manufacturer() {
        return this._manufacturer;
    }

    get netWeight() {
        return this._netWeight || undefined;
    }

    get status() {
        return this._status;
    }

    get createdByRole() {
        return this._createdByRole;
    }

    get createdAt() {
        return this._createdAt;
    }

    get updatedAt() {
        return this._updatedAt;
    }

    get version() {
        return this._version;
    }
}
