import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TestState {
    value: number
}

const testSlice = createSlice({
    name: 'test',
    initialState: {value: 0} as TestState,
    reducers: {
        increase: (state) => {
            state.value = state.value + 1;
        },
        decrease: (state) => {
            state.value = state.value - 1;
        }
    },
})

const { actions, reducer } = testSlice
export const { increase, decrease } = actions
export default reducer