// src/store/api/catsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const CATS_SERVICE_URL = process.env.REACT_APP_CATS_SERVICE_URL || 'http://localhost:3000';

export const catsApi = createApi({
  reducerPath: 'catsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: CATS_SERVICE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Cats'],
  endpoints: (builder) => ({
    getCats: builder.query({
      query: () => '/cats',
      providesTags: ['Cats'],
      keepUnusedDataFor: 300,
    }),
    updateCatStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/cats/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Cats'],
    }),
  }),
});

export const { useGetCatsQuery, useUpdateCatStatusMutation } = catsApi;