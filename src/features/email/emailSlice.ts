import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OperationType } from '../../types';


interface SearchEmailState {
    operationType: OperationType;
    operationValue?: string;
}

const initialState: SearchEmailState = {
    operationType: 'receiver',
    operationValue: '',
};

const emailSlice = createSlice({
    name: 'email',
    initialState,
    reducers: {
        setOperation: (state, action) => {
            state = { ...action.payload };
        },
        setOperationValue: (state, action: PayloadAction<string>) => {
            state.operationValue = action.payload;
        }
    },
});

export const { setOperation, setOperationValue } = emailSlice.actions;

export default emailSlice.reducer;