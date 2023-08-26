import { configureStore } from "@reduxjs/toolkit";
import testSlice from './features/test/testSlice'
import prismSlice from './features/prism/prismSlice'

export const store = configureStore({
    reducer: {
        testSlice,
        prismSlice,
    },
    devTools: process.env.NODE_ENV !== 'production',
    // middleware(getDefaultMiddleware) {
    //     getDefaultMiddleware().concat(loggerMiddleware)
    // },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch;