import { configureStore } from "@reduxjs/toolkit";
import testSlice from './features/test/testSlice'
import prismSlice from './features/prism/prismSlice'

const loggerMiddleware =
  ({ dispatch, getState }: any) =>
  (next: any) =>
  (action: any) => {
    console.log(action);
    return next(action);
  };

export const store = configureStore({
    reducer: {
        testSlice,
        prismSlice
    },
    // middleware(getDefaultMiddleware) {
    //     getDefaultMiddleware().concat(loggerMiddleware)
    // },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch;