// Express REST server for the search service.
import express from 'express';
import {SearchProductsUseCase} from '../../application/use-cases/search-products.usecase.js';
import {productSearchRepository} from '../../infra/repositories/product.search.repository.js';
import {getElasticClient} from "../../infra/persistence/elastic.js";
import {searchController} from "./search.controller.ts.js";

/**
 * Starts the REST server for the search service.
 * @param {string} elasticUrl - The Elasticsearch connection URL.
 * @returns {Promise<import('express').Express>} Promise resolving to the Express app instance.
 */
export async function startServer(elasticUrl) {
    const app = express();

    const repo = productSearchRepository(elasticUrl);
    const searchUseCase = new SearchProductsUseCase(repo);

    await getElasticClient(elasticUrl); // in order to create index.
    searchController(app, searchUseCase);

    const port = Number(process.env.PORT || 4001);

    return new Promise((resolve) => {
        app.listen(port, () => {
            console.log(`Search service running on port ${port}`);
            resolve(app);
        });
    });
}
