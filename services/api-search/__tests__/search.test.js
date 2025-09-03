import express from 'express';
import request from 'supertest';
import { searchController } from '../src/presentation/rest/search.controller.ts.js';
import { SearchProductsUseCase } from '../src/application/use-cases/search-products.usecase.js';
import { IndexProductUseCase } from '../src/application/use-cases/index-product.usecase.js';
import { jest } from '@jest/globals';

describe('SearchProductsUseCase', () => {
  it('returns [] when query is empty', async () => {
    const repo = { search: jest.fn(async () => []) };
    const uc = new SearchProductsUseCase(repo);
    const res = await uc.execute('');
    expect(res.isSuccess).toBe(true);
    expect(res.unwrap()).toEqual([]);
  });

  it('delegates to repository when query provided', async () => {
    const repo = { search: jest.fn(async () => [{ toPrimitives: () => ({ name: 'Milk' }) }]) };
    const uc = new SearchProductsUseCase(repo);
    const res = await uc.execute('milk');
    expect(repo.search).toHaveBeenCalledWith('milk');
    expect(res.isSuccess).toBe(true);
    expect(res.unwrap()).toHaveLength(1);
  });
});

describe('IndexProductUseCase', () => {
  it('indexes product via repository', async () => {
    const repo = { index: jest.fn(async () => {}) };
    const uc = new IndexProductUseCase(repo);
    const r = await uc.execute({ toPrimitives: () => ({ id: '1' }) });
    expect(r.isSuccess).toBe(true);
    expect(repo.index).toHaveBeenCalled();
  });
});

describe('searchController', () => {
  it('returns 200 and array when use case returns Ok', async () => {
    const app = express();
    const uc = { execute: jest.fn(async () => ({ isFailure: false, unwrapOr: () => [{ toPrimitives: () => ({ name: 'Yogurt' }) }] })) };
    searchController(app, uc);
    const res = await request(app).get('/search?q=yogurt');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ name: 'Yogurt' }]);
  });

  it('returns 500 when use case fails', async () => {
    const app = express();
    const uc = { execute: jest.fn(async () => ({ isFailure: true, errorValue: () => ({ message: 'boom' }), unwrapOr: () => [] })) };
    searchController(app, uc);
    const res = await request(app).get('/search?q=fail');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'boom' });
  });
});
