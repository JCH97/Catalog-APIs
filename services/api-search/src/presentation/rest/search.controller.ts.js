export function searchController(app, searchUseCase) {
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
}
