import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface GlobalState {
    orbitControlState: boolean,
}

const globalSlice = createSlice({
    name: 'global',
    initialState: {
        orbitControlState: true,
    } as GlobalState,
    reducers: {
        toggleOrbitControl(state, action: PayloadAction<boolean>) {
            state.orbitControlState = action.payload
        }
    }
});

const { reducer, actions } = globalSlice;
export const {
    toggleOrbitControl
} = actions;
export default reducer;