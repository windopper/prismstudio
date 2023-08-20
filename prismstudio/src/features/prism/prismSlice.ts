import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { store } from "../../store";

let currentId = 0;

export interface ElementState {
  id: number;
  position: number[]
}

function createElementState(): ElementState {
  return {
    id: currentId++,
    position: [0, 0, 0]
  }
}

export interface PrismState {
  orbitControlState: boolean,
  focusOn: number | undefined;
  elements: ElementState[];
}

const prismSlice = createSlice({
  name: "prism",
  initialState: {
    focusOn: undefined,
    elements: [] as ElementState[]
  } as PrismState,
  reducers: {
    toggleOrbitControl(state, action: PayloadAction<boolean>) {
      state.orbitControlState = action.payload
    },
    addNewComponent: (state) => {
      state.elements.push(createElementState());
    },
    deleteFocusedComponent: (state) => {
      state.elements = state.elements.filter((v) => v.id !== state.focusOn);
      state.focusOn = undefined;
    },
    focusComponent: (state, action: PayloadAction<{ id: number }>) => {
      state.focusOn = action.payload.id;
    },
    outFocusComponent: (state) => {
      state.focusOn = undefined;
    },
    updateFocusedComponentPosition: (state, action: PayloadAction<{position: number[]}>) => {
      if (state.focusOn == undefined) return;
      const filteredElement: ElementState[] = state.elements.filter((_, i) => i === state.focusOn);
      if (filteredElement.length == 0) return;
      let position = action.payload.position;
      position = position.map((v) => Math.round(v * 1000) / 1000)
      filteredElement[0].position = position;
    }
  },
});

const { reducer, actions } = prismSlice;
export const {
  toggleOrbitControl,
  addNewComponent,
  deleteFocusedComponent,
  focusComponent,
  outFocusComponent,
  updateFocusedComponentPosition
} = actions;

export default reducer;
