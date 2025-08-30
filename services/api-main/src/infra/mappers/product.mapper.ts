import {ProductEntity} from '../../domain/entities/product.entity';
import type {ProductDto} from "../../application/dtos/product.dtos";

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
            id: d.id,
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
