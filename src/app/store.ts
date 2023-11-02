import { configureStore } from "@reduxjs/toolkit";

import counterReducer from '../features/counter/couterSlice';
import tokenReducer from '../features/token/tokenSlice';

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        token: tokenReducer,
    }
});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;