import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setAccessToken } from "../features/auth/authSlice";

// prepare headers
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_ISHOP_URL,
  // headers
  prepareHeaders: (header, { getState }) => {
    const accessToken =  getState().auth.accessToken;
    if (accessToken) {
      header.set("Authorization", `bearer ${accessToken}`);
    }
    return header;
  },
});

const baseQueryWithReAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshToken = sessionStorage.getItem('refreshToken');

    const res = await fetch(
      `${import.meta.env.VITE_BASE_ISHOP_URL}/auth/refresh`,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      },
    );
    if (res.ok) {
      const data = await res.json();
      console.log('==> new accessToken:', data?.accessToken);
      api.dispatch(setAccessToken(data?.accessToken));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(setAccessToken(null));
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery:baseQueryWithReAuth,
  endpoints: () => ({}),
});
