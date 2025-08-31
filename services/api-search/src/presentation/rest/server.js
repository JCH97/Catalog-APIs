// Express REST server for the search service.
import express from 'express';
import {SearchProductsUseCase} from '../../application/use-cases/search-products.usecase.js';
import {productSearchRepository} from '../../infra/repositories/product.search.repository.js';

/**
 * Starts the REST server.
 * @param {string} elasticUrl
 */
export async function startServer(elasticUrl) {
    const app = express();
    const repo = productSearchRepository(elasticUrl);
    const searchUseCase = new SearchProductsUseCase(repo);

    app.get('/search', async (req, res) => {
        const q = (req.query.q || '').toString();
        const result = await searchUseCase.execute(q);

        if (result.isFailure) {
            const err = result.errorValue();
            return res.status(500).json({error: err?.message || 'Search error'});
        }

        const items = result.unwrapOr([]);
        res.json(items.map((p) => p.toPrimitives()));
    });

    const port = Number(process.env.PORT || 4001);
    return new Promise((resolve) => {
        app.listen(port, () => {
            console.log(`Search service running on port ${port}`);
            resolve(app);
        });
    });
}
