import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ecommerceApi = createApi({
  reducerPath: "ecommerceApi",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_ISHOP_URL,
  }),

  endpoints: (builder) => ({
    // Get all products
    getAllProducts: builder.query({
      query: () => "/products",
      transformResponse: (response) => response?.content ?? [],
    }),

    // Get product by UUID
    getProductByUuid: builder.query({
      query: (uuid) => `/products/${uuid}`,
    }),

    // Add product
    addNewProduct: builder.mutation({
      query: ({ createProduct, accessToken }) => ({
        url: "/products",
        method: "POST",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: createProduct,
      }),
    }),

    // Update product
    updateProductByUUID: builder.mutation({
      query: ({ uuid, updateProduct, accessToken }) => ({
        url: `/products/${uuid}`,
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: updateProduct,
      }),
    }),

    // Delete product
    deleteProductByUUID: builder.mutation({
      query: ({ uuid, accessToken }) => ({
        url: `/products/${uuid}`,
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }),
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByUuidQuery,
  useAddNewProductMutation,
  useUpdateProductByUUIDMutation,
  useDeleteProductByUUIDMutation,
} = ecommerceApi;