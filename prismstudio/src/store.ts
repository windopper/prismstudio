import { configureStore } from "@reduxjs/toolkit";
import prismSlice from './prism/redux/prismSlice'

export const store = configureStore({
    reducer: {
        prismSlice,
    },
    devTools: process.env.NODE_ENV !== 'production',
    // middleware(getDefaultMiddleware) {
    //     getDefaultMiddleware().concat(loggerMiddleware)
    // },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch;