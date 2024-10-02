import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userApiSlice } from "./slices/userApiSlice";
import { companyApiSlice } from "./slices/companyApiSlice";
import { orderApiSlice } from "./slices/orderApiSlice";
import { adminApiSlice } from "./slices/adminApiSlice";
import { chatApiSlice } from "./slices/chatApiSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import orderReducer from "../context/OrderContext";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["order"],
};

const rootReducer = combineReducers({
  [userApiSlice.reducerPath]: userApiSlice.reducer,
  [companyApiSlice.reducerPath]: companyApiSlice.reducer,
  [adminApiSlice.reducerPath]: adminApiSlice.reducer,
  [orderApiSlice.reducerPath]: orderApiSlice.reducer,
  [chatApiSlice.reducerPath]: chatApiSlice.reducer,
  order: orderReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: ["order.date", "payload.0"],
      },
    }).concat(
      userApiSlice.middleware,
      companyApiSlice.middleware,
      adminApiSlice.middleware,
      orderApiSlice.middleware,
      chatApiSlice.middleware
    ),
});

export const persistor = persistStore(store);
export default store;
export type RootState = ReturnType<typeof rootReducer>;
