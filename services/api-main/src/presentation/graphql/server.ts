import express from 'express';
import cors from 'cors';
import {ApolloServer} from 'apollo-server-express';
import {resolvers, typeDefs} from './schema.js';
import {connectMongo} from '../../infra/persistence/mongodb.js';
import {ProductRepository} from '../../infra/repositories/product.repository';
import {auditRepository} from '../../infra/repositories/audit.repository';
import {createRedisPublisher} from '../../infra/messaging/message-bus';
import {authMiddleware} from '../../infra/auth/auth.middleware';
import {CreateProductUseCase} from '../../application/use-cases/create-product.usecase.js';
import {UpdateProductUseCase} from '../../application/use-cases/update-product.usecase.js';
import {ApproveProductUseCase} from '../../application/use-cases/approve-product.usecase.js';
import {GetProductUseCase} from '../../application/use-cases/get-product.usecase.js';
import {GetAllProductsUsecase} from '../../application/use-cases/get-all-products.usecase';
import {createAuditByProductIdLoader} from '../../infra/loaders/audit-by-productId.loader';
import {createProductByIdLoader} from '../../infra/loaders/product-by-Id.loader';
import {SignInUseCase} from "../../application/use-cases/signin.usecase";

export async function startGraphQLServer() {
    await connectMongo();
    const productRepo = ProductRepository();
    const auditRepo = auditRepository();
    const publisher = await createRedisPublisher(process.env.REDIS_URL || 'redis://localhost:6379');

    const uc = {
        createProduct: new CreateProductUseCase(productRepo, auditRepo, publisher),
        updateProduct: new UpdateProductUseCase(productRepo, auditRepo, publisher),
        approveProduct: new ApproveProductUseCase(productRepo, auditRepo, publisher),
        getProduct: new GetProductUseCase(productRepo),
        listProducts: new GetAllProductsUsecase(productRepo),
        signIn: new SignInUseCase(),
    };

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({req}: { req: any }) => {
            const loaders = {
                getAuditByProductId: createAuditByProductIdLoader(),
                getProductById: createProductByIdLoader(),
            };
            return {user: (req as any).user, uc, loaders};
        },
    });

    await server.start();

    const app = express();

    app.use(cors());
    app.use(authMiddleware);

    server.applyMiddleware({app});

    const port = Number(process.env.PORT || 4000);

    await new Promise<void>((resolve) => {
        app.listen({port}, () => {
            console.log(`🚀 GraphQL server ready at http://localhost:${port}${server.graphqlPath}`);
            resolve();
        });
    });
}
