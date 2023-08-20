import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { store } from "../../store";
import { toggleOrbitControl } from "../global/globalSlice";

let currentId = 0;

export interface ElementState {
  id: number;
}

function createElementState(): ElementState {
  return {
    id: currentId++,
  }
}

export interface PrismState {
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
    addNewComponent: (state) => {
      state.elements.push(createElementState());
    },
    deleteComponent: (state, action: PayloadAction<{ id: number }>) => {
      state.elements = state.elements.filter((v) => v.id !== action.payload.id);
    },
    focusComponent: (state, action: PayloadAction<{ id: number }>) => {
      state.focusOn = action.payload.id;
    },
    outFocusComponent: (state, action) => {
      state.focusOn = undefined;
    },
  },
});

const { reducer, actions } = prismSlice;
export const {
  addNewComponent,
  deleteComponent,
  focusComponent,
  outFocusComponent,
} = actions;

export default reducer;
