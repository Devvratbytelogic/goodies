import { configureStore } from "@reduxjs/toolkit";
import { api } from "@/store/api";
import "@/store/endpoints/cartApi";
import "@/store/endpoints/wishlistApi";

export function makeStore() {
  return configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["api/executeMutation/fulfilled"],
          ignoredPaths: ["api.mutations"],
        },
      }).concat(api.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
