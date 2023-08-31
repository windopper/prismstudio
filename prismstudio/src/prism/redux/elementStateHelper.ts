import { WritableDraft } from "immer/dist/internal";
import { ElementState, GroupComponents, PrismState, SingleComponent } from "./prismSlice";

export function registerElementState(state: WritableDraft<PrismState>, newElementState: ElementState) {
    state.elementStates.allIds.push(newElementState.id);
    state.elementStates.byId[newElementState.id] = newElementState;
}

export function removeElementState(state: WritableDraft<PrismState>, elementStateId: string) {
    state.elementStates.allIds = state.elementStates.allIds.filter(v => v !== elementStateId);
    delete state.elementStates.byId[elementStateId];
}