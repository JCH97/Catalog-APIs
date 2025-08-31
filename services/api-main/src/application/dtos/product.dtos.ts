export type NetWeightOutputDTO = {
    value: number;
    unit: string;
};

export type ProductDto = {
    _id: string;
    gtin: string;
    name: string;
    description?: string | null;
    brand?: string | null;
    manufacturer?: string | null;
    netWeight?: NetWeightOutputDTO | null;
    status: string;
    createdByRole: string;
    createdAt: string;
    updatedAt: string;
    version: number;
};

export type NetWeightInputDTO = {
    value: number;
    unit: 'GRAM' | 'KILOGRAM' | 'OUNCE' | 'POUND';
};

export type CreateProductInputDto = {
    gtin: string;
    name: string;
    description?: string | null;
    brand?: string | null;
    manufacturer?: string | null;
    netWeight?: NetWeightInputDTO | null;
};

export type UpdateProductInputDTO = Partial<Omit<CreateProductInputDto, 'gtin'>>;

export type ApproveProductInputDTO = { id: string };
export type GetProductInputDTO = { id: string };
