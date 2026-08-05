import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// prepare headers
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_ISHOP_URL,
  // headers
  prepareHeaders: (header, {getState}) => {
    const accessToken = import.meta.env.VITE_ACCESS_TOKEN;
    if(accessToken){
      header.set('Authorization', `bearer ${accessToken}`)
    }
    return header;
  }
})

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery,
  endpoints: () => ({})
})
