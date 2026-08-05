import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { baseApi } from "./baseApi";


export const productApi = baseApi.injectEndpoints({
  
  endpoints: (builder) => ({
 
    // Get all products
    getAllProducts: builder.query({
      query: () => "/products",
      
    }),

    // Get product by UUID
    getProductByUuid: builder.query({
      query: (uuid) => `/products/${uuid}`,
    }),
    // create, update, delete (mutation)
    // Add product
    addNewProduct: builder.mutation({
      query: ({ createProduct}) => ({
        method: "POST",
        url: "/products",        
        body: createProduct,
      }),
    }),

    // Update product
    updateProductByUUID: builder.mutation({
      query: ({ uuid, updateProduct, accessToken }) => ({
        method: "PUT",
        url: `/products/${uuid}`,
        body: updateProduct,
      }),
    }),

    // Delete product
    deleteProductByUUID: builder.mutation({
      query: ({ uuid, accessToken }) => ({
        method: "DELETE",
        url: `/products/${uuid}`,
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
} = baseApi;