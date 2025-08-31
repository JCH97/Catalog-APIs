import { ProductEntity } from '../entities/product.entity.js';
import { AuditEntity } from '../entities/audit.entity.js';

export interface IProductRepository {
  findAll(): Promise<ProductEntity[]>;
  findById(id: string): Promise<ProductEntity | null>;
  save(product: ProductEntity): Promise<void>;
  update(product: ProductEntity): Promise<void>;
}

export interface IAuditRepository {
  add(entry: AuditEntity): Promise<void>;
  findByProductId(productId: string): Promise<AuditEntity[]>;
}
