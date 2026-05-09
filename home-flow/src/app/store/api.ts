import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Object, Indication, Meter } from "@/shared/interfaces/types";

// Типы для запросов
interface SaveObjectRequest {
  name: string;
  userId: string;
  meters: Meter[];
}

interface CreateIndicationRequest {
  date: string;
  values: { meterId: string; value: number }[];
  objectId: string;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001/api",
    prepareHeaders: (headers) => {
      // Можно добавить токен авторизации
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Objects", "Indications", "Object", "UserObjects"],
  endpoints: (builder) => ({
    // Получение объектов пользователя
    getUserObjects: builder.query<Object[], string>({
      query: (userId) => `/auth/objects/${userId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Objects" as const,
                id: _id,
              })),
              { type: "Objects", id: "LIST" },
            ]
          : [{ type: "Objects", id: "LIST" }],
    }),

    // Получение объекта по ID
    getObjectById: builder.query<Object, string>({
      query: (id) => `/objects/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Object", id }],
    }),

    // Получение показаний объекта
    getObjectIndications: builder.query<Indication[], string>({
      query: (objectId) => `/objects/${objectId}/indications`,
      providesTags: (result, _error, objectId) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Indications" as const,
                id: _id,
              })),
              { type: "Indications", id: objectId },
            ]
          : [{ type: "Indications", id: objectId }],
    }),

    // Создание объекта
    saveObject: builder.mutation<Object, SaveObjectRequest>({
      query: (body) => ({
        url: "/objects/save",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Objects", id: "LIST" }],
    }),

    // Удаление объекта
    deleteObject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/objects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Objects", id: "LIST" },
        { type: "Object", id },
      ],
    }),

    // Создание показания
    createIndication: builder.mutation<Indication, CreateIndicationRequest>({
      query: (body) => ({
        url: "/indications/create",
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { objectId }) => [
        { type: "Indications", id: objectId },
      ],
    }),

    // Удаление показания
    deleteIndication: builder.mutation<void, string>({
      query: (id) => ({
        url: `/indications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Indications", id }],
    }),

    // Обновление счетчиков объекта
    updateObjectMeters: builder.mutation<
      Object,
      { id: string; meters: Meter[] }
    >({
      query: ({ id, meters }) => ({
        url: `/objects/${id}/meters`,
        method: "PUT",
        body: { meters },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Object", id },
        { type: "Objects", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetUserObjectsQuery,
  useGetObjectByIdQuery,
  useGetObjectIndicationsQuery,
  useSaveObjectMutation,
  useDeleteObjectMutation,
  useCreateIndicationMutation,
  useDeleteIndicationMutation,
  useUpdateObjectMetersMutation,
} = api;
