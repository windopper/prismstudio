import { WritableDraft } from "immer/dist/internal";
import { GroupComponents, PrismState, SingleComponent } from "./prismSlice";
import { COMPONENT_TOP_POINTER } from "../constants";

export function registerComponent(
  state: WritableDraft<PrismState>,
  newComponent: GroupComponents | SingleComponent
) {
  state.components.allIds.push(newComponent.id);
  state.components.byId[newComponent.id] = newComponent;
}

export function removeComponent(
  state: WritableDraft<PrismState>,
  componentId: string
) {
  const component = state.components.byId[componentId];
  if (component === undefined) return;
  const topPointerComponent = state.components.byId[
    component.topPointer
  ] as GroupComponents;

  if (topPointerComponent) {
    topPointerComponent.components = topPointerComponent.components.filter(
      (v) => v !== component.id
    );
  }
  state.components.allIds = state.components.allIds.filter(
    (v) => v !== componentId
  );
  delete state.components.byId[componentId];
}

export function putComponentToGroupComponent(
  state: WritableDraft<PrismState>,
  componentId: string,
  groupComponentId: string,
) {
  const component = state.components.byId[componentId];
  const groupComponent = state.components.byId[groupComponentId] as GroupComponents;
  if (component === undefined || groupComponent === undefined) return;
  if (component.topPointer === groupComponentId) return;
  groupComponent.components.push(component.id);
  component.topPointer = groupComponent.id;
}

export function moveComponentTo(
  state: WritableDraft<PrismState>,
  componentId: string,
  to: string
) {
  const __component = state.components.byId[componentId];
  if (to === COMPONENT_TOP_POINTER) {
    
  }
  else {
    const __moveTo = state.components.byId[to] as GroupComponents;
    if (__moveTo === undefined || __moveTo.type !== 'GroupComponents' || __component === undefined) return;
    __moveTo.components.push(componentId);
  }
  
  const __prev = __component.topPointer;
  if (__prev !== COMPONENT_TOP_POINTER) {
    const __prevComponent = state.components.byId[__prev] as GroupComponents;
    __prevComponent.components = __prevComponent.components.filter(v => v !== componentId);
  }
  __component.topPointer = to;
}

export function iterateChildComponents(
  state: WritableDraft<PrismState>,
  rootComponentIds: string[],
  callbackfn?: (
    childComponent:
      | WritableDraft<SingleComponent>
      | WritableDraft<GroupComponents>
  ) => void
) {
    let componentIds: string[] = rootComponentIds;
    while (componentIds.length !== 0) {
        let nextComponentIds = [];

        for (let id of componentIds) {
            let component = state.components.byId[id];
            if (component === undefined) continue;
            callbackfn && callbackfn(component);
            if (component.type === 'GroupComponents') {
                nextComponentIds.push(
                  ...(component as GroupComponents).components
                );
            }
        }

        componentIds = nextComponentIds;
    }
}

export function getChildren(state: WritableDraft<PrismState>, componentIds: string[]): string[] {
  const ret: string[] = [];
  iterateChildComponents(state, componentIds, (__component) => {
    ret.push(__component.id);
  })
  return ret;
}
