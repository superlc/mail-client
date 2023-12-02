import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EmailType, OperationType } from '../../types';


export interface SearchEmailState {
    operationType: OperationType;
    operationValue: string;
    forceReload?: boolean;
}

const initialState: SearchEmailState = {
    operationType: 'receiver',
    operationValue: '',
    forceReload: false,
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
        },
        setForceReload: (state) => {
            state.forceReload = !state.forceReload;
        }
    },
});

export const { setOperation, setOperationValue, setForceReload } = emailSlice.actions;

export default emailSlice.reducer;