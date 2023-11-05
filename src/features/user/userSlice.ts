import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserType } from '../../types';

interface UserState {
    data: UserType | null;
}

const initialState: UserState = { data: null };

const tokenSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<UserType>) => {
            state.data = action.payload;
        },
        resetUserInfo: (state) => {
            state.data = null;
        },
    },
});

export const { setUserInfo, resetUserInfo } = tokenSlice.actions;

export default tokenSlice.reducer;