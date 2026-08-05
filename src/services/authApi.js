import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    userLogin: builder.mutation({
      query: ({userLoginRequest}) => ({
        url: '/auth/login',
        method: 'POST',
        body: userLoginRequest
      })
    }),

    userRegister: builder.mutation({
      query: ({userRegisterRequest}) => ({
        url: '/users/user-signup',
        method: 'POST',
        body: userRegisterRequest
      })
    })
  })
})

export const {
  useUserLoginMutation,
  useUserRegisterMutation
} = authApi;
