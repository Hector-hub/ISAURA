import { configureStore } from "@reduxjs/toolkit";
import alertsSlice from "./slices/alertsSlice";
import mapSlice from "./slices/mapSlice";
import uiSlice from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    alerts: alertsSlice,
    map: mapSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ["map.bounds"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
