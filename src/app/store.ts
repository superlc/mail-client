import { configureStore } from "@reduxjs/toolkit";

import counterReducer from '../features/counter/couterSlice';
import tokenReducer from '../features/token/tokenSlice';
import userReducer from '../features/user/userSlice';

export const store = configureStore({
    reducer: {
        counter: counterReducer,
        token: tokenReducer,
        user: userReducer,
    }
});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;