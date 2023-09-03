import { WritableDraft } from "immer/dist/internal";
import { PrismState } from "./prismSlice";
import { iterateChildComponents } from "./componentHelper";
import { current } from "@reduxjs/toolkit";

export const setFocusOn = (
    state: WritableDraft<PrismState>,
    newFocusOn: string[]
) => {
    iterateChildComponents(state, state.focusOn, (__component) => {
        __component.isFocused = false;
    })
    iterateChildComponents(state, newFocusOn, (__component) => {
        __component.isFocused = true;
    })
    state.focusOn = newFocusOn;
}