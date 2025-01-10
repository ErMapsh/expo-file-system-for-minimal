import { configureStore } from "@reduxjs/toolkit";
import OfflineVideoStateSlice from './features/OfflineVideoStateSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      'offlinevideo': OfflineVideoStateSlice,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
