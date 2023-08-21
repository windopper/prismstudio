import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { store } from "../../store";

let currentId = 0;

export interface ElementState {
  id: number;
  position: number[];
  rotate: number[];
  scale: number[];
}

function createElementState(): ElementState {
  return {
    id: currentId++,
    position: [0, 0, 0],
    rotate: [0, 0, 0],
    scale: [0, 0, 0],
  };
}

type TransformControlsMode = "translate" | "rotate" | "scale";

export interface PrismState {
  transformControlsMode: TransformControlsMode;
  orbitControlState: boolean;
  focusOn: number | undefined;
  elements: ElementState[];
}

const prismSlice = createSlice({
  name: "prism",
  initialState: {
    transformControlsMode: "translate",
    orbitControlState: true,
    focusOn: undefined,
    elements: [] as ElementState[],
  } as PrismState,
  reducers: {
    setTransformControlsMode(
      state,
      action: PayloadAction<{ mode: TransformControlsMode }>
    ) {
      state.transformControlsMode = action.payload.mode;
    },
    toggleOrbitControl(state, action: PayloadAction<boolean>) {
      state.orbitControlState = action.payload;
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
    updateFocusedComponentPosition: (
      state,
      action: PayloadAction<{ position: number[] }>
    ) => {
      if (state.focusOn == undefined) return;
      const filteredElement: ElementState[] = state.elements.filter(
        (_, i) => i === state.focusOn
      );
      if (filteredElement.length == 0) return;
      let position = action.payload.position;
      position = position.map((v) => Math.round(v * 1000) / 1000);
      filteredElement[0].position = position;
    },
    updateFocusedComponent: (
      state,
      action: PayloadAction<{
        position: number[];
        scale: number[];
        rotate: number[];
      }>
    ) => {
      if (state.focusOn == undefined) return;
      const filteredElement: ElementState[] = state.elements.filter(
        (_, i) => i === state.focusOn
      );
      if (filteredElement.length == 0) return;
      
      let { position, rotate, scale } = action.payload;
      position = position.map((v) => Math.round(v * 1000) / 1000);
      filteredElement[0].position = position;
      filteredElement[0].rotate = rotate;
      filteredElement[0].scale = scale;
    },
  },
});

const { reducer, actions } = prismSlice;
export const {
  setTransformControlsMode,
  toggleOrbitControl,
  addNewComponent,
  deleteFocusedComponent,
  focusComponent,
  outFocusComponent,
  updateFocusedComponentPosition,
  updateFocusedComponent,
} = actions;

export default reducer;
