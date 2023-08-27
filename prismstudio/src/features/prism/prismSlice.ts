import { Action, PayloadAction, createSlice, current } from "@reduxjs/toolkit";
import { store } from "../../store";

type TransformControlsMode = "translate" | "rotate" | "scale";
type ComponentId = number;
type ElementId = number;

let currentId = 0;

export interface ElementState {
  id: number;
  name: string,
  currentComponentId: number;
  position: [x: number, y: number, z: number];
  rotate: [x: number, y: number, z: number];
  scale: [x: number, y: number, z: number];
}

function createElementState(): ElementState {
  return {
    id: currentId++,
    name: "컴포넌트 박스",
    currentComponentId: -1,
    position: [0, 0, 0],
    rotate: [0, 0, 0],
    scale: [0, 0, 0],
  };
}

export interface Component {
  id: ComponentId;
  name: string,
  elementIds: ElementId[];
}

function createGroupComponent(): Component {
  return {
    id: currentId++,
    name: "컴포넌트 콜렉션",
    elementIds: [] as ElementId[],
  };
}

export interface PrismState {
  transformControlsMode: TransformControlsMode; // 컨트롤 모드 설정
  orbitControlState: boolean; // 공전 컨트롤러 활성화 여부
  focusOn: ComponentId | undefined; // 어떤 컴포넌트를 조작하고 있는지
  enableGroupSelection: boolean; // 그룹 선택 기능 활성화 여부
  currentGroupSelectionComponents: Component[]; // 현재 선택한 컴포넌트들
  elementStates: ElementState[]; // 요소 정보들
  components: Component[]; // 그룹 또는 단일 컴포넌트들
}

const prismSlice = createSlice({
  name: "prism",
  initialState: {
    transformControlsMode: "translate",
    orbitControlState: true,
    focusOn: undefined,
    enableGroupSelection: false,
    currentGroupSelectionComponents: [],
    elementStates: [] as ElementState[],
    components: [] as Component[],
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
    // 새로운 컴포넌트 생성
    addNewComponent: (state) => {
      const newElementState = createElementState();
      const newComponent = createGroupComponent();
      newComponent.elementIds.push(newElementState.id);
      newElementState.currentComponentId = newComponent.id;
      state.elementStates.push(newElementState);
      state.components.push(newComponent);
    },
    deleteFocusedComponent: (state) => {
      const component = current(
        state.components.find((v) => v.id === state.focusOn)
      );
      if (component === undefined) return;

      state.components = state.components.filter((v) => v.id !== state.focusOn);
      state.elementStates = state.elementStates.filter(v => v.currentComponentId !== state.focusOn);
      state.focusOn = undefined;
    },
    focusComponent: (state, action: PayloadAction<{ id: ComponentId }>) => {
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
      action: PayloadAction<{ componentId: ComponentId }>
    ) => {
      if (!state.enableGroupSelection) return;
      let result = state.currentGroupSelectionComponents.find(
        (v) => v.id === action.payload.componentId
      );
      if (result === undefined) {
        let component = state.components.find(
          (v) => v.id === action.payload.componentId
        );
        if (component === undefined) return;
        state.currentGroupSelectionComponents.push(component);
      } else {
        state.currentGroupSelectionComponents =
          state.currentGroupSelectionComponents.filter(
            (v) => action.payload.componentId !== v.id
          );
      }
    },
    updateElementStates: (
      state,
      action: PayloadAction<{
        elementId: ElementId,
        position: [x: number, y: number, z: number],
        rotate: [x: number, y: number, z: number],
        scale: [x: number, y: number, z: number],
      }[]>
    ) => {
      for (let { elementId, position, rotate, scale } of action.payload) {
        const elementStateIndex = state.elementStates.findIndex((v) => v.id === elementId);
        if (elementStateIndex === -1) return;
  
        position = position.map((v) => Math.round(v * 1000) / 1000) as [
          x: number,
          y: number,
          z: number
        ];
        state.elementStates[elementStateIndex].position = position;
        state.elementStates[elementStateIndex].rotate = rotate;
        state.elementStates[elementStateIndex].scale = scale;
      }
    },
    attachGroupComponents: (state) => {
      const newComponent: Component = createGroupComponent();
      const newElementIds = [];

      // 그룹핑 된 컴포넌트를 하나의 컴포넌트로 합친 후 요소 상태를 갱신하기
      for (let component of state.currentGroupSelectionComponents) {
        for (let elementId of component.elementIds) {
          newElementIds.push(elementId);
          const elementStateIndex = state.elementStates.findIndex(
            (v) => v.id === elementId
          );
          state.elementStates[elementStateIndex].currentComponentId =
            newComponent.id;
        }
      }
      newComponent.elementIds = newElementIds;

      // 기존에 존재했던 컴포넌트를 제거하기
      for (let componentId of state.currentGroupSelectionComponents.map(
        (v) => v.id
      )) {
        state.components = state.components.filter((v) => v.id !== componentId);
      }

      // 새로운 그룹 컴포넌트를 삽입
      state.components.push(newComponent);
      state.currentGroupSelectionComponents = [];
      state.focusOn = newComponent.id;
    },
    detachGroupComponents: (
      state,
    ) => {
      const component = state.components.find(v => v.id === state.focusOn);
      if (component === undefined ) return;
      const newComponents = [];

      for (let elementId of component.elementIds) {
        const elementState = state.elementStates.find(v => v.id === elementId);
        if (elementState === undefined) continue;
        const newComponent = createGroupComponent();
        newComponent.elementIds.push(elementId);
        elementState.currentComponentId = newComponent.id;
        newComponents.push(newComponent);
      }

      state.components = state.components.filter(v => v.id !== state.focusOn);
      state.components = state.components.concat(newComponents);
      state.focusOn = undefined;
    },
    detachComponentFromGroup: (
      state,
      action: PayloadAction<{elementId: number}>
    ) => {
      const { elementId } = action.payload;
    
      const elementState = state.elementStates.find(v => v.id === elementId);
      if (elementState === undefined) return;
      const groupComponent = state.components.find(v => v.id === elementState.currentComponentId);
      if (groupComponent === undefined) return;

      if (groupComponent.elementIds.length == 1) return;

      groupComponent.elementIds = groupComponent.elementIds.filter(id => id !== elementId);
      const newComponent = createGroupComponent();
      elementState.currentComponentId = newComponent.id;
      newComponent.elementIds.push(elementState.id);
      state.components.push(newComponent);
    }
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

  updateElementStates,

  attachGroupComponents,
  detachGroupComponents,
  detachComponentFromGroup,
} = actions;

export default reducer;
