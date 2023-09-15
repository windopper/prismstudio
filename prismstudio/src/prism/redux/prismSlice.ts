import { PayloadAction, createSlice, current } from "@reduxjs/toolkit";
import { iterateChildComponents, moveComponentTo, registerComponent, removeComponent } from "./componentHelper";
import { registerElementState, removeElementState } from "./elementStateHelper";
import { COMPONENT_TOP_POINTER } from "../constants";
import {
  getComponentIdIfTopComponentSame,
  seperateSingleAndGroup,
  isComponentsAllSameType,
  mergeComponentsToNewGroupAndGet,
  mergeComponentsToExistGroupAndGet,
} from "./attachGroupComponents";
import { setFocusOn } from "./prismSliceUtil";
import { filterIfChildren } from "./focusComponent";

type TransformControlsMode = "translate" | "rotate" | "scale";
type ComponentId = string;
type ElementId = string;

export type ThreeArray = [x: number, y: number, z: number];

export interface TransformControlsState {
  position: ThreeArray,
  rotate: ThreeArray,
  scale: ThreeArray,
}

let currentId = 1;

/* 요소 상태 */
export interface ElementState {
  id: ElementId;
  name: string,
  wrapComponentId: ComponentId, // 감싼 컴포넌트의 아이디
  position: ThreeArray;
  rotate: ThreeArray;
  scale: ThreeArray;
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
    wrapComponentId: "component-0",
    position: [0, 0, 0],
    rotate: [0, 0, 0],
    scale: [1, 1, 1],
  };
}

export function createSingleComponent(elementId: ElementId): SingleComponent {
  return {
    id: `component-${currentId++}`,
    type: "SingleComponent",
    name: "컴포넌트 박스",
    elementState: elementId,
    isFocused: false,
    topPointer: "component-0",
  };
}

export function createGroupComponent(): GroupComponents {
  return {
    id: `component-${currentId++}`,
    type: "GroupComponents",
    name: "컴포넌트 콜렉션",
    components: [],
    isFocused: false,
    topPointer: "component-0",
  }
}

export interface PrismNormalizedElementState {
    "byId": {[key: string]: ElementState},
    "allIds": ElementId[]
}

export interface PrismNormalizedComponentState {
  "byId": {[key: string]: (GroupComponents | SingleComponent)},
  "allIds": ComponentId[]
}; 

export interface PrismState {
  transformControlsState: TransformControlsState | undefined;
  transformControlsMode: TransformControlsMode; // 컨트롤 모드 설정
  orbitControlState: boolean; // 공전 컨트롤러 활성화 여부
  focusOn: ComponentId[] // 선택한 컴포넌트 아이디 리스트
  enableGroupSelection: boolean; // 그룹 선택 기능 활성화 여부
  elementStates: PrismNormalizedElementState; // 요소 정보들
  components: PrismNormalizedComponentState; // 그룹 또는 단일 컴포넌트들
}

const prismSlice = createSlice({
  name: "prism",
  initialState: {
    transformControlsState: undefined,
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
    setTransformControlsState(
      state,
      action: PayloadAction<{ transformControlsState: TransformControlsState | undefined}>
    ) { 
      if (action.payload.transformControlsState === undefined) {
        state.transformControlsState = undefined;
        return;
      }
      const position = action.payload.transformControlsState.position.map(v => Math.round(v * 1000) / 1000) as ThreeArray;
      const scale = action.payload.transformControlsState.scale.map(v => Math.round(v * 1000) / 1000) as ThreeArray;
      const rotate = action.payload.transformControlsState.rotate.map(v => Math.round(v * 1000) / 1000) as ThreeArray;
      
      state.transformControlsState = {
        position,
        rotate,
        scale
      }
    },
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
      newElementState.wrapComponentId = newSingleComponent.id;
      registerElementState(state, newElementState);
      registerComponent(state, newSingleComponent);
    },
    deleteFocusedComponent: (state) => {
      let componentIds: string[] = current(state.focusOn)
      const deleteElementStateIds: ElementId[] = []
      const deleteComponentIds: ComponentId[] = []

      iterateChildComponents(state, componentIds, (component) => {
        if (component.type === 'SingleComponent') {
          component = component as SingleComponent
          const elementState = state.elementStates.byId[component.elementState]
          deleteElementStateIds.push(elementState.id)
        } 
        deleteComponentIds.push(component.id);
      })

      deleteElementStateIds.forEach(v => removeElementState(state, v));
      deleteComponentIds.forEach(v => removeComponent(state, v));
      state.focusOn = [];
    },
    focusComponent: (state, action: PayloadAction<{ componentId: ComponentId }>) => {
      const { componentId } = action.payload;
      /* 현재 컴포넌트가 이미 선택되어 있는지 */
      const isFocusOn = state.components.byId[componentId].isFocused;
      /* 그룹 선택 옵션이 켜져 있는지 */
      const isEnableGroupSelection = state.enableGroupSelection;

      if (isEnableGroupSelection) {
        if (isFocusOn) {
          const next = [...current(state.focusOn)].filter(v => v !== componentId);
          setFocusOn(state, next);
        }
        else {
          const next = filterIfChildren(state, [...current(state.focusOn)], componentId);
          next.push(componentId);
          setFocusOn(state, next);
        }
      }
      else {
        const next = [componentId];
        setFocusOn(state, next);
      }
    },
    outFocusComponent: (state, action: PayloadAction<{ componentId?: ComponentId }>) => {
      const componentId = action.payload?.componentId;
      let componentIds = componentId === undefined ? current(state.focusOn) : [componentId];

      iterateChildComponents(state, componentIds, (component) => {
        component.isFocused = false;
      });

      if (componentId === undefined) state.focusOn = [];
      else state.focusOn = state.focusOn.filter(v => v !== componentId);
      state.transformControlsState = undefined;
    },
    setGroupSelectionMode: (
      state,
      action: PayloadAction<{ enabled: boolean }>
    ) => {
      state.enableGroupSelection = action.payload.enabled;
    },
    updateElementStates: (
      state,
      action: PayloadAction<{
        elementId: ElementId,
        position: ThreeArray,
        rotate: ThreeArray,
        scale: ThreeArray,
      }[]>
    ) => {
      for (let { elementId, position, rotate, scale } of action.payload) {
        const elementState = state.elementStates.byId[elementId];
        position = position.map(v => Math.round(v * 1000) / 1000) as ThreeArray;
        rotate = rotate.map(v => Math.round(v * 1000) / 1000) as ThreeArray;
        scale = scale.map(v => Math.round(v * 1000) / 1000) as ThreeArray;
        elementState.position = position;
        elementState.rotate = rotate;
        elementState.scale = scale;
      }
    },
    attachGroupComponents: (state) => {
      if (state.focusOn.length === 0) return;
      const isAllSingle = isComponentsAllSameType(
        state,
        state.focusOn,
        "SingleComponent"
      );
      const isAllGroup = isComponentsAllSameType(
        state,
        state.focusOn,
        "GroupComponents"
      );
      const { groupComponentIds, singleComponentIds } =
        seperateSingleAndGroup(state, state.focusOn);

      if (isAllSingle || isAllGroup) {
        let topPointer = getComponentIdIfTopComponentSame(state, state.focusOn);
        topPointer ?? (topPointer = COMPONENT_TOP_POINTER);
        const groupComponent = mergeComponentsToNewGroupAndGet(
          state,
          state.focusOn,
          topPointer
        );
        state.focusOn = [groupComponent.id];
      }
      if (groupComponentIds.length === 1 && singleComponentIds.length >= 1) {
        const groupComponent = mergeComponentsToExistGroupAndGet(
          state,
          groupComponentIds[0],
          singleComponentIds
        );
        groupComponent && (state.focusOn = [groupComponent.id]);
      }
      
    },
    detachGroupComponents: (
      state,
    ) => {
      const currentFocusOn = current(state.focusOn);
      const newFocusOn: string[] = [];
      for (let componentId of currentFocusOn) {
        const __component = state.components.byId[componentId];
        const { type, topPointer } = __component;

        if (type === 'GroupComponents'){
          (__component as GroupComponents).components.forEach(
            v => {
              moveComponentTo(state, v, topPointer)
              newFocusOn.push(v);
            }
          )
          removeComponent(state, componentId);
        }
        else {
          const __topPointerCompnent = state.components.byId[topPointer];
          if (__topPointerCompnent) {
            const __topPointerOfTopPointer = __topPointerCompnent.topPointer;
            moveComponentTo(state, componentId, __topPointerOfTopPointer);
          }
          newFocusOn.push(componentId);
        }
      }
      setFocusOn(state, newFocusOn);
    },
}});


const { reducer, actions } = prismSlice;
export const {
  setTransformControlsState,
  setTransformControlsMode,

  toggleOrbitControl,

  addNewComponent,
  deleteFocusedComponent,

  focusComponent,
  outFocusComponent,

  setGroupSelectionMode,

  updateElementStates,

  attachGroupComponents,
  detachGroupComponents,
} = actions;

export default reducer;
