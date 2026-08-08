

import { baseApi } from "./baseApi";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    userProfile: builder.query({
      query: () => `/users/me`
    })
  })
})
export const {
    useUserProfileQuery
} = profileApi;