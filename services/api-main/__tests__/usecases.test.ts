import { CreateProductUseCase } from '../src/application/use-cases/create-product.usecase.js';
import { ApproveProductUseCase } from '../src/application/use-cases/approve-product.usecase.js';
import { UpdateProductUseCase } from '../src/application/use-cases/update-product.usecase.js';
import { GetProductUseCase } from '../src/application/use-cases/get-product.usecase.js';
import { GetAllProductsUsecase } from '../src/application/use-cases/get-all-products.usecase.js';
import { Role } from '../src/domain/enums/role.js';
import { ProductEntity } from '../src/domain/entities/product.entity.js';
import { ProductStatus } from '../src/domain/enums/product-status.enum.js';
import { Result } from '../src/shared/result/result.js';
import { jest } from '@jest/globals';

// Minimal fakes
const makeProduct = (overrides = {}) => {
  const res = ProductEntity.create({
    gtin: '12345678',
    name: 'Milk',
    description: 'desc',
    brand: 'BrandX',
    manufacturer: 'Maker',
    netWeight: { value: 1, unit: 'KILOGRAM' }
  }, Role.EDITOR);

  const p = res.unwrap();
  Object.assign(p, overrides);
  return p;
};

const mockPublisher = () => ({ publish: jest.fn(async () => {}) });
const mockAuditRepo = () => ({ add: jest.fn(async () => {}), findByProductId: jest.fn(async () => []) });

describe('CreateProductUseCase', () => {
  it('creates product as PUBLISHED when actor is EDITOR', async () => {
    const repo = { save: jest.fn(async () => {}), findById: jest.fn(), findAll: jest.fn(), update: jest.fn() };
    const uc = new CreateProductUseCase(repo as any, mockAuditRepo() as any, mockPublisher() as any);
    const res = await uc.execute({ gtin: '12345678', name: 'Yogurt' }, Role.EDITOR);
    expect(res.isSuccess).toBe(true);

    const p: any = res.unwrap();

    expect(p.status).toBe(ProductStatus.PUBLISHED);
    expect(repo.save).toHaveBeenCalled();
  });

  it('creates product as PENDING_REVIEW when actor is PROVIDER', async () => {
    const repo = { save: jest.fn(async () => {}), findById: jest.fn(), findAll: jest.fn(), update: jest.fn() };
    const uc = new CreateProductUseCase(repo as any, mockAuditRepo() as any, mockPublisher() as any);
    const res = await uc.execute({ gtin: '12345678', name: 'Butter' }, Role.PROVIDER);
    expect(res.isSuccess).toBe(true);

    const p: any = res.unwrap();
    expect(p.status).toBe(ProductStatus.PUBLISHED);
    expect(repo.save).toHaveBeenCalled();
  });
});

describe('ApproveProductUseCase', () => {
  it('fails when product not found', async () => {
    const repo = { findById: jest.fn(async () => null), update: jest.fn(), findAll: jest.fn(), save: jest.fn() };
    const uc = new ApproveProductUseCase(repo as any, mockAuditRepo() as any, mockPublisher() as any);
    const res = await uc.execute('nope', Role.EDITOR);
    expect(res.isFailure).toBe(true);
  });

  it('approves a pending product and publishes event', async () => {
    const p = makeProduct();
    // Force initial state to PENDING_REVIEW
    (p as any)._status = ProductStatus.PENDING_REVIEW;
    const repo = {
      findById: jest.fn(async () => p),
      update: jest.fn(async () => {}),
      findAll: jest.fn(), save: jest.fn()
    };
    const publisher = mockPublisher();
    const auditRepo = mockAuditRepo();
    const uc = new ApproveProductUseCase(repo as any, auditRepo as any, publisher as any);
    const res = await uc.execute(p.plainId, Role.EDITOR);
    expect(res.isSuccess).toBe(true);
    expect(repo.update).toHaveBeenCalled();
    expect(auditRepo.add).toHaveBeenCalled();
    expect(publisher.publish).toHaveBeenCalledWith(
      'domain-events',
      expect.stringContaining('product.approved')
    );
  });
});

describe('UpdateProductUseCase', () => {
  it('prevents PROVIDER from updating when not in PENDING_REVIEW', async () => {
    const p = makeProduct();
    (p as any)._status = ProductStatus.PUBLISHED;
    const repo = { findById: jest.fn(async () => p), update: jest.fn(async () => {}), findAll: jest.fn(), save: jest.fn() };
    const uc = new UpdateProductUseCase(repo as any, mockAuditRepo() as any, mockPublisher() as any);
    const res = await uc.execute(p.plainId, { name: 'New name' }, Role.PROVIDER);
    expect(res.isFailure).toBe(true);
  });

  it('allows EDITOR to update fields and records audit', async () => {
    const p = makeProduct();
    const repo = { findById: jest.fn(async () => p), update: jest.fn(async () => {}), findAll: jest.fn(), save: jest.fn() };
    const auditRepo = mockAuditRepo();
    const publisher = mockPublisher();
    const uc = new UpdateProductUseCase(repo as any, auditRepo as any, publisher as any);
    const res = await uc.execute(p.plainId, { name: 'New name' }, Role.EDITOR);
    expect(res.isSuccess).toBe(true);
    expect(repo.update).toHaveBeenCalled();
    expect(auditRepo.add).toHaveBeenCalled();
    expect(publisher.publish).toHaveBeenCalledWith(
      'domain-events',
      expect.stringContaining('product.updated')
    );
  });
});

describe('GetProduct & GetAll', () => {
  it('returns NotFound when missing', async () => {
    const repo = { findById: jest.fn(async () => null), findAll: jest.fn(async () => []), save: jest.fn(), update: jest.fn() };
    const get = new GetProductUseCase(repo as any);
    const res = await get.execute('missing');
    expect(res.isFailure).toBe(true);
  });
  it('returns list', async () => {
    const repo = { findAll: jest.fn(async () => [makeProduct()]), findById: jest.fn(), save: jest.fn(), update: jest.fn() };
    const getAll = new GetAllProductsUsecase(repo as any);
    const res = await getAll.execute();
    expect(res.isSuccess).toBe(true);
    expect(res.unwrap()).toHaveLength(1);
  });
});
