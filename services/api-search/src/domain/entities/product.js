import {Result} from "../../shared/result/result.js";

export class Product {
    /**
     * Constructs a Product. Use static factory methods when possible.
     * @param {object} props
     * @param {string} props.id
     * @param {string} props.gtin
     * @param {string} props.name
     * @param {string} [props.description]
     * @param {string} [props.brand]
     * @param {string} [props.manufacturer]
     * @param {{ value: number, unit: string }} [props.netWeight]
     * @param {string} [props.status]
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
     * @param {object} data
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
     * @returns {object}
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
