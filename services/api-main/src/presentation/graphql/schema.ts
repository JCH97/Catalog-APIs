/**
 * GraphQL schema definitions and resolvers for the Product API.
 *
 * - Defines types, enums, inputs, queries, and mutations for products, audits, and authentication.
 * - Implements resolvers to handle fetching and mutating product and audit data.
 * - Integrates with application use cases and data mappers.
 */

import {gql} from 'apollo-server-express';
import GraphQLJSON from 'graphql-type-json';
import {ProductMapper} from "../../infra/mappers/product.mapper.js";
import {AppError} from "../../shared/errors.js";

// GraphQL type definitions and resolvers for products
export const typeDefs = gql`
  scalar JSON
  enum Role { PROVIDER EDITOR }
  enum ProductStatus { PENDING_REVIEW PUBLISHED }
  enum AuditAction { CREATED UPDATED APPROVED }
  type NetWeight { value: Float unit: String }
  type ChangeItem { field: String before: String after: String }
  type Audit { 
    productId: ID! 
    action: AuditAction! 
    changedAt: String!
    changedByRole: String! 
    changes: [ChangeItem!]! 
    version: Int!
    productBeforeSnapshot: JSON
    productAfterSnapshot: JSON
  }
  type Product {
    _id: ID!
    gtin: String!
    name: String!
    description: String
    brand: String
    manufacturer: String
    netWeight: NetWeight
    status: ProductStatus!
    createdByRole: Role!
    createdAt: String!
    updatedAt: String!
    version: Int!
    history: [Audit!]!
  }
  type TokenResponse {
    token: String!
  }
  input SignIn {
    role: Role!
  }
  input NetWeightInput { value: Float unit: String }
  input CreateProductInput { gtin: String!, name: String!, description: String, brand: String, manufacturer: String, netWeight: NetWeightInput }
  input UpdateProductInput { name: String, description: String, brand: String, manufacturer: String, netWeight: NetWeightInput }
  type Query {
    products: [Product!]!
    product(id: ID!): Product
  }
  type Mutation {
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product!
    approveProduct(id: ID!): Product!
    signIn(input: SignIn!): TokenResponse!
  }
`;

export const resolvers = {
    JSON: GraphQLJSON,
    Product: {
        history: async (parent: any, _args: any, context: any) => {
            return await context.loaders.getAuditByProductId.load(parent._id);
        },
    },
    Query: {
        products: async (_: any, __: any, context: any) => {
            const res = await context.uc.listProducts.execute();
            const products = res.unwrap();
            return products.map((p: any) => ProductMapper.domainToDto(p));
        },
        product: async (_: any, {id}: any, context: any) => {
            const product = await context.loaders.getProductById.load(id);
            return product ? ProductMapper.domainToDto(product) : AppError.NotFound('Product not found').throw();
        }
    },
    Mutation: {
        createProduct: async (_: any, {input}: any, context: any) => {
            if (!context.user) throw new Error('Unauthenticated');

            const res = await context.uc.createProduct.execute(input, context.user.role);

            const p = res.unwrap();
            return ProductMapper.domainToDto(p);
        },
        updateProduct: async (_: any, {id, input}: any, context: any) => {
            if (!context.user) throw new Error('Unauthenticated');

            const res = await context.uc.updateProduct.execute(id, input, context.user.role);

            const p = res.unwrap();
            return ProductMapper.domainToDto(p);
        },
        approveProduct: async (_: any, {id}: any, context: any) => {
            if (!context.user) throw new Error('Unauthenticated');

            const res = await context.uc.approveProduct.execute(id, context.user.role);

            const p = res.unwrap();
            return ProductMapper.domainToDto(p);
        },
        signIn: async (_: any, {input}: any, context: any) => {
            return await context.uc.signIn.execute(input.role);
        }
    },
};
