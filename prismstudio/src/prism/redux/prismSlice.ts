import { Action, PayloadAction, createSlice, current } from "@reduxjs/toolkit";
import { store } from "../../store";
import { getChildComponentIdsFromComponent, getChildElementIdsFromComponents } from "../utils/componentUtil";
import { WritableDraft } from "immer/dist/internal";
import { iterateChildComponents, putComponentToGroupComponent, registerComponent, removeComponent } from "./componentHelper";
import { registerElementState, removeElementState } from "./elementStateHelper";
import { COMPONENT_TOP_POINTER } from "../constants";

type TransformControlsMode = "translate" | "rotate" | "scale";
type ComponentId = string;
type ElementId = string;

let currentId = 1;

/* 요소 상태 */
export interface ElementState {
  id: ElementId;
  name: string,
  wrapComponentId: ComponentId, // 감싼 컴포넌트의 아이디
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
    wrapComponentId: "component-0",
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

export interface PrismNormalizedElementState {
    "byId": {[key: string]: ElementState},
    "allIds": ElementId[]
}

export interface PrismNormalizedComponentState {
  "byId": {[key: string]: (GroupComponents | SingleComponent)},
  "allIds": ComponentId[]
}; 

export interface PrismState {
  transformControlsMode: TransformControlsMode; // 컨트롤 모드 설정
  orbitControlState: boolean; // 공전 컨트롤러 활성화 여부
  focusOn: ComponentId[] // 선택한 컴포넌트 아이디 리스트
  enableGroupSelection: boolean; // 그룹 선택 기능 활성화 여부
  //currentGroupSelectionComponents: SingleComponent[]; // 현재 선택한 컴포넌트들
  elementStates: PrismNormalizedElementState; // 요소 정보들
  components: PrismNormalizedComponentState; // 그룹 또는 단일 컴포넌트들
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
        let componentIds = [componentId];

        if (isFocusOn) {
          iterateChildComponents(state, componentIds, (component) => {
            component.isFocused = false;
          })
          /* 포커싱 리스트에서 제외 */
          state.focusOn = state.focusOn.filter(v => v !== componentId);
        }
        else {
          iterateChildComponents(state, componentIds, (component) => {
            component.isFocused = true;
          })
          state.focusOn.push(componentId);
        }
      }
      else {
        let componentIds = current(state.focusOn);
        iterateChildComponents(state, componentIds, (component) => {
          component.isFocused = false;
        })
        componentIds = [componentId];
        iterateChildComponents(state, componentIds, (component) => {
          component.isFocused = true;
        })

        state.focusOn = [componentId];
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
      for (let { elementId, position, rotate, scale } of action.payload) {
        const elementState = state.elementStates.byId[elementId];
        elementState.position = position;
        elementState.rotate = rotate;
        elementState.scale = scale;
      }
    },
    attachGroupComponents: (state) => {
      if (state.focusOn.length === 0) return;
      let topPointer: string = "temp-pointer";
      const currentFocusOn = current(state.focusOn);

      const isFocusOnAllTopPointerIsSame: boolean = (() => {
        for (let componentId of currentFocusOn) {
          const curTopPointer = state.components.byId[componentId].topPointer;
          if (topPointer === "temp-pointer") topPointer = curTopPointer;
          else if (topPointer !== curTopPointer) return false;
        }
        return true;
      })();

      if (!isFocusOnAllTopPointerIsSame) return;

      /* 새로운 그룹을 만들고 저장 */
      const newGroupComponent = createGroupComponent();
      newGroupComponent.topPointer = topPointer;
      newGroupComponent.isFocused = true;
      newGroupComponent.components = [...currentFocusOn];
      state.components.byId[newGroupComponent.id] = newGroupComponent;
      state.components.allIds.push(newGroupComponent.id);

      /* 지정된 컴포넌트들의 topPointer를 새로운 그룹으로 지정 */
      for (let componentIds of currentFocusOn) {
        const component = state.components.byId[componentIds];
        component.topPointer = newGroupComponent.id;
      }
      
      /* 선택된 컴포넌트의 상위 포인터가 최상위 포인터가 아닐 때 
        상위 그룹 컴포넌트에 새로운 그룹 id를 넣고 이전 컴포넌트들을 제거 */
      if (topPointer !== COMPONENT_TOP_POINTER) {
        const topPointerComponent = state.components.byId[topPointer];
        const topPointerGroupComponent = (topPointerComponent as GroupComponents);
        topPointerGroupComponent.components.push(newGroupComponent.id);
        topPointerGroupComponent.components =
          topPointerGroupComponent.components.filter(
            (v, i) => currentFocusOn.find((v2) => v2 === v) === undefined
          );
      }
      
      state.focusOn = [newGroupComponent.id];
    },
    detachGroupComponents: (
      state,
    ) => {
      const currentFocusOn = current(state.focusOn);
      for (let componentId of currentFocusOn) {
        const component = state.components.byId[componentId];
        const { type, topPointer } = component;

        if (type === 'GroupComponents') {
          /* 포커싱한 컴포넌트를 포함하는 그룹 컴포넌트 */
          const topPointerComponent = state.components.byId[topPointer] as GroupComponents;
          const groupComponentIds: string[] = [];
          const singleComponentIds: string[] = [];
  
          iterateChildComponents(state, [componentId], (component) => {
            const type = component.type;
            component.isFocused = false;
            if (type === 'GroupComponents') groupComponentIds.push(component.id);
            else singleComponentIds.push(component.id);
          })
  
          groupComponentIds.forEach(v => removeComponent(state, v))
  
          singleComponentIds.forEach(v => {
            topPointerComponent ? putComponentToGroupComponent(state, v, topPointer) : (
              state.components.byId[v].topPointer = COMPONENT_TOP_POINTER
            )
          })
        }
        else {
          
        }

      }

      state.focusOn = [];
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
