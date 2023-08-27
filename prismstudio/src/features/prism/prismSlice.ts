import { Action, PayloadAction, createSlice, current } from "@reduxjs/toolkit";
import { store } from "../../store";

type TransformControlsMode = "translate" | "rotate" | "scale";
type ComponentId = string;
type ElementId = string;

let currentId = 1;

export const COMPONENT_TOP_POINTER = "component-0";

/* 요소 상태 */
export interface ElementState {
  id: ElementId;
  name: string,
  position: [x: number, y: number, z: number];
  rotate: [x: number, y: number, z: number];
  scale: [x: number, y: number, z: number];
}

/* 컴포넌트 기본 속성 */
export interface BaseComponent {
  id: ComponentId,
  type: "GroupComponents" | "SingleComponent",
  name: string,
  isFocused: boolean,
  topPointer: ComponentId,
}

/* 그룹 컴포넌트 속성 */
export interface GroupComponents extends BaseComponent {
  components: ComponentId[]
}

/* 단일 컴포넌트 속성 */
export interface SingleComponent extends BaseComponent {
  elementState: ElementId,
}

function createElementState(): ElementState {
  return {
    id: `element-${currentId++}`,
    name: "컴포넌트 박스",
    position: [0, 0, 0],
    rotate: [0, 0, 0],
    scale: [0, 0, 0],
  };
}

function createSingleComponent(elementId: ElementId): SingleComponent {
  return {
    id: `component-${currentId++}`,
    type: "SingleComponent",
    name: "컴포넌트 박스",
    elementState: elementId,
    isFocused: false,
    topPointer: "component-0",
  };
}

function createGroupComponent(): GroupComponents {
  return {
    id: `component-${currentId++}`,
    type: "GroupComponents",
    name: "컴포넌트 콜렉션",
    components: [],
    isFocused: false,
    topPointer: "component-0",
  }
}

export interface PrismState {
  transformControlsMode: TransformControlsMode; // 컨트롤 모드 설정
  orbitControlState: boolean; // 공전 컨트롤러 활성화 여부
  focusOn: ComponentId[] // 선택한 컴포넌트 아이디 리스트
  enableGroupSelection: boolean; // 그룹 선택 기능 활성화 여부
  //currentGroupSelectionComponents: SingleComponent[]; // 현재 선택한 컴포넌트들
  elementStates: {
    "byId": {[key: string]: ElementState},
    "allIds": ElementId[]
  }; // 요소 정보들
  components: {
    "byId": {[key: string]: (GroupComponents | SingleComponent)},
    "allIds": ComponentId[]
  }; // 그룹 또는 단일 컴포넌트들
}

const prismSlice = createSlice({
  name: "prism",
  initialState: {
    transformControlsMode: "translate",
    orbitControlState: true,
    focusOn: [],
    enableGroupSelection: false,
    elementStates: {
      "byId": {},
      "allIds": []
    },
    components: {
      "byId": {},
      "allIds": []
    },
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
      const newSingleComponent = createSingleComponent(newElementState.id);
      state.elementStates.allIds.push(newElementState.id);
      state.elementStates.byId[newElementState.id] = newElementState;
      state.components.allIds.push(newSingleComponent.id);
      state.components.byId[newSingleComponent.id] = newSingleComponent
    },
    deleteFocusedComponent: (state) => {
      let componentIds: string[] = current(state.focusOn)
      const deleteElementStateIds: ElementId[] = []
      const deleteComponentIds: ComponentId[] = []

      // 포레스트 구조의 컴포넌트를 순회함
      while(componentIds.length !== 0) {
        const newComponentIds: string[] = []

        for (const componentId of componentIds) {
          let component = state.components.byId[componentId];
          /* 중간 노드에 도달하면 다음 순회에 자신의 아이디를 넣음 */
          if (component.type === 'GroupComponents') {
            component = component as GroupComponents
            newComponentIds.push(component.id)
            deleteComponentIds.push(component.id);
          }
          /* 리프 노드에 도달하면 자기자신과 elementState를 포함하여 제거할 리스트에 삽입 */
          else if (component.type === 'SingleComponent') {
            component = component as SingleComponent
            const elementState = state.elementStates.byId[component.elementState]
            deleteElementStateIds.push(elementState.id)
            deleteComponentIds.push(component.id);
          }
        }

        componentIds = newComponentIds;
      }
      
      for (const id of deleteElementStateIds) {
        state.elementStates.allIds = state.elementStates.allIds.filter(v => v !== id);
        delete state.elementStates.byId[id];
      }
      for (const id of deleteComponentIds) {
        state.components.allIds = state.components.allIds.filter(v => v !== id);
        delete state.components.byId[id];
      }

      state.focusOn = [];
    },
    focusComponent: (state, action: PayloadAction<{ componentId: ComponentId, type: "set" | "add" }>) => {
      const { componentId, type} = action.payload;
      if (type === 'set') {
        let componentIds = current(state.focusOn);

        /* 이전 focus 컴포넌트의 isFocused를 false로 전환 */
        while(componentIds.length !== 0) {
          let newComponentIds = [];

          for (let id of componentIds) {
            let component = state.components.byId[id];

            if (component.type === 'GroupComponents') {
              component = component as GroupComponents;
              newComponentIds.push(...component.components)
            }
            component.isFocused = false;
          }

          componentIds = newComponentIds;
        }

        /* 현재 선택된 컴포넌트의 isFocused를 true로 전환 */
        componentIds = [componentId];
        while(componentId.length !== 0) {
          let newComponentIds = [];

          for (let id of componentIds) {
            let component = state.components.byId[id];

            if (component.type === 'GroupComponents') {
              component = component as GroupComponents;
              newComponentIds.push(...component.components)
            }
            component.isFocused = true;
          }
        }

        state.focusOn = [componentId];
      }
      else {
        let componentIds = [componentId];
        while(componentId.length !== 0) {
          let newComponentIds = [];

          for (let id of componentIds) {
            let component = state.components.byId[id];

            if (component.type === 'GroupComponents') {
              component = component as GroupComponents;
              newComponentIds.push(...component.components)
            }
            component.isFocused = true;
          }
        }

        state.focusOn.push(componentId);
      }
    },
    outFocusComponent: (state) => {

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

    },
    attachGroupComponents: (state) => {
      
    },
    detachGroupComponents: (
      state,
    ) => {

    },
    detachComponentFromGroup: (
      state,
      action: PayloadAction<{elementId: number}>
    ) => {

    }
}});

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
