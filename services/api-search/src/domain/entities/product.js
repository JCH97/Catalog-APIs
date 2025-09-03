import {Result} from "../../shared/result/result.js";

/**
 * Represents a product entity.
 * @class
 */
export class Product {
    /**
     * Constructs a Product. Use static factory methods when possible.
     * @constructor
     * @param {object} props - The product properties.
     * @param {string} props.id - The product ID.
     * @param {string} props.gtin - The product GTIN.
     * @param {string} props.name - The product name.
     * @param {string} [props.description] - The product description.
     * @param {string} [props.brand] - The product brand.
     * @param {string} [props.manufacturer] - The product manufacturer.
     * @param {{ value: number, unit: string }} [props.netWeight] - The product net weight.
     * @param {string} [props.status] - The product status.
     */
    constructor(props) {
        this.id = props.id;
        this.gtin = props.gtin;
        this.name = props.name;
        this.description = props.description ?? null;
        this.brand = props.brand ?? null;
        this.manufacturer = props.manufacturer ?? null;
        this.netWeight = props.netWeight ?? null;
        this.status = props.status ?? null;
    }

    /**
     * Creates a Product instance from plain data.
     * @param {object} data - The plain data object.
     * @returns {Result<Product, Error>} Result containing the hydrated Product.
     */
    static hydrate(data) {
        return Result.Ok(new Product({
            id: data._id,
            gtin: data.gtin,
            name: data.name,
            description: data.description,
            brand: data.brand,
            manufacturer: data.manufacturer,
            netWeight: data.netWeight,
            status: data.status,
        }));
    }

    /**
     * Converts the Product into plain data suitable for persistence or transport.
     * @returns {object} The plain data representation of the product.
     */
    toPrimitives() {
        return {
            id: this.id,
            gtin: this.gtin,
            name: this.name,
            description: this.description,
            brand: this.brand,
            manufacturer: this.manufacturer,
            netWeight: this.netWeight,
            status: this.status,
        };
    }
}
