import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EmailType, OperationType } from '../../types';


interface SearchEmailState {
    operationType: OperationType;
    operationValue: string;
}

const initialState: SearchEmailState = {
    operationType: 'receiver',
    operationValue: '',
};

const emailSlice = createSlice({
    name: 'email',
    initialState,
    reducers: {
        setOperation: (state, action: PayloadAction<SearchEmailState>) => {
            const { operationType, operationValue } = action.payload;
            state.operationType = operationType;
            state.operationValue = operationValue;
        },
        setOperationValue: (state, action: PayloadAction<string>) => {
            state.operationValue = action.payload;
        }
    },
});

export const { setOperation, setOperationValue } = emailSlice.actions;

export default emailSlice.reducer;