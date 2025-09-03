import {ProductEntity} from '../../domain/entities/product.entity.js';
import type {ProductDto} from "../../application/dtos/product.dtos.js";

/**
 * Mapper class for transforming product data between different layers.
 * - domainToPersistence: Converts a domain entity to a persistence format.
 * - persistenceToDomain: Converts raw persistence data to a domain entity.
 * - domainToDto: Converts a domain entity to a Data Transfer Object (DTO).
 */
export class ProductMapper {
    public static domainToPersistence(p: ProductEntity): any {
        return p.toPrimitives();
    }

    public static persistenceToDomain(raw: any): ProductEntity {
        return ProductEntity.hydrate(raw).unwrap();
    }

    public static domainToDto(p: ProductEntity): ProductDto {
        const d = p.toPrimitives();
        return {
            _id: d._id,
            gtin: d.gtin,
            name: d.name,
            description: d.description ?? null,
            brand: d.brand ?? null,
            manufacturer: d.manufacturer ?? null,
            netWeight: d.netWeight ? {value: d.netWeight.value, unit: d.netWeight.unit} : null,
            status: d.status,
            createdByRole: d.createdByRole,
            createdAt: d.createdAt.toISOString(),
            updatedAt: d.updatedAt.toISOString(),
            version: d.version,
        };
    }
}
