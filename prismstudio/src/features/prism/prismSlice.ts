import { Action, PayloadAction, createSlice, current } from "@reduxjs/toolkit";
import { store } from "../../store";

let currentId = 0;

export interface ElementState {
  id: number;
  position: [x: number, y: number, z: number];
  rotate: [x: number, y: number, z: number];
  scale: [x: number, y: number, z: number];
}

function createElementState(): ElementState {
  return {
    id: currentId++,
    position: [0, 0, 0],
    rotate: [0, 0, 0],
    scale: [0, 0, 0],
  };
}

export interface GroupElementState {
  id: number;
  elements: ElementState[];
}

function createGroupElementState(): GroupElementState {
  return {
    id: currentId++,
    elements: []
  }
}

type TransformControlsMode = "translate" | "rotate" | "scale";

export interface PrismState {
  transformControlsMode: TransformControlsMode;
  orbitControlState: boolean;
  focusOn: number | undefined;
  enableGroupSelection: boolean;
  currentGroupSelectionElements: number[];
  elements: ElementState[];
  groupElements: GroupElementState[];
}

const prismSlice = createSlice({
  name: "prism",
  initialState: {
    transformControlsMode: "translate",
    orbitControlState: true,
    focusOn: undefined,
    enableGroupSelection: false,
    currentGroupSelectionElements: [],
    elements: [] as ElementState[],
    groupElements: [] as GroupElementState[],
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
    setGroupSelectionMode: (
      state,
      action: PayloadAction<{ enabled: boolean }>
    ) => {
      state.enableGroupSelection = action.payload.enabled;
    },
    toggleGroupSelectionElements: (
      state, 
      action: PayloadAction<{elementId: number}>
    )  => {
      if (!state.enableGroupSelection) return;
      let result: number | undefined = state.currentGroupSelectionElements.find(
        (v) => v === action.payload.elementId
      );
      if (result === undefined) {
        state.currentGroupSelectionElements.push(action.payload.elementId);
      }
      else {
        state.currentGroupSelectionElements =
        state.currentGroupSelectionElements.filter(
          (v) => action.payload.elementId !== v
        );
      }
    },
    updateFocusedComponentPosition: (
      state,
      action: PayloadAction<{ position: [x: number, y: number, z: number]; }>
    ) => {
      if (state.focusOn == undefined) return;
      const filteredElement: ElementState[] = state.elements.filter(
        (_, i) => i === state.focusOn
      );
      if (filteredElement.length == 0) return;
      let position: [x: number, y: number, z: number] = action.payload.position;
      position = position.map((v) => Math.round(v * 1000) / 1000) as [x: number, y: number, z: number]; 
      filteredElement[0].position = position;

      console.log(position);
    },
    updateFocusedComponent: (
      state,
      action: PayloadAction<{
        position: [x: number, y: number, z: number],
        scale: [x: number, y: number, z: number],
        rotate: [x: number, y: number, z: number],
      }>
    ) => {
      if (state.focusOn == undefined) return;
      const filteredElement: ElementState[] = state.elements.filter(
        (_, i) => i === state.focusOn
      );
      if (filteredElement.length == 0) return;

      let { position, rotate, scale } = action.payload;
      position = position.map((v) => Math.round(v * 1000) / 1000) as [x: number, y: number, z: number];
      filteredElement[0].position = position;
      filteredElement[0].rotate = rotate;
      filteredElement[0].scale = scale;
    },
    attachGroupComponents: (
      state,
    ) => {
      const groupElement: GroupElementState = createGroupElementState();
      let elements: ElementState[] = [];

      for (let elementId of state.currentGroupSelectionElements) {
        const isSameElementId = (v: ElementState) => {
          return v.id === elementId
        };
        const index = state.elements.findIndex(isSameElementId);
        elements.push(current(state.elements[index]))
        state.elements = state.elements.filter((_, i) => i !== index);
      }

      groupElement.elements = elements;
      state.groupElements.push(groupElement);

      state.currentGroupSelectionElements = []
    },
    detachGroupComponents: (
      state,
      action: PayloadAction<{ groupIds: number[] }>
    ) => {},
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

  setGroupSelectionMode,
  toggleGroupSelectionElements,

  updateFocusedComponentPosition,
  updateFocusedComponent,

  attachGroupComponents,
  detachGroupComponents,
} = actions;

export default reducer;
