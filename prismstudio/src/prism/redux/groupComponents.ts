import { WritableDraft } from "immer/dist/internal";
import {
  GroupComponents,
  PrismState,
  createGroupComponent,
} from "./prismSlice";
import { moveComponentTo, registerComponent } from "./componentHelper";
import { COMPONENT_TOP_POINTER } from "../constants";

export const isComponentsAllSameType = (
  state: WritableDraft<PrismState>,
  componentIds: string[],
  type: "SingleComponent" | "GroupComponents"
): boolean => {
  for (const __componentId of componentIds) {
    const __component = state.components.byId[__componentId];
    if (__component.type !== type) return false;
  }
  return true;
};

export const seperateSingleAndGroup = (
    state: WritableDraft<PrismState>,
    componentIds: string[]
): {
    groupComponentIds: string[],
    singleComponentIds: string[]
} => {
    let groupComponentIds: string[] = [];
    let singleComponentIds: string[] = [];

    componentIds.forEach(id => {
        const __component = state.components.byId[id];
        const type = __component.type;
        type === 'GroupComponents' ? groupComponentIds.push(id) : singleComponentIds.push(id);
    })

    return {
        groupComponentIds,
        singleComponentIds
    }
}

export const getComponentIdIfTopComponentSame = (
  state: WritableDraft<PrismState>,
  componentIds: string[]
): string | undefined => {
  let topPointer = "temp-pointer";
  for (let __componentId of componentIds) {
    const curPointer = state.components.byId[__componentId].topPointer;
    if (topPointer === "temp-pointer") topPointer = curPointer;
    else if (topPointer === curPointer) continue;
    else return undefined;
  }
  return topPointer === "temp-pointer" ? undefined : topPointer;
};

export const mergeComponentsToNewGroupAndGet = (
  state: WritableDraft<PrismState>,
  components: string[],
  topPointer: string
): GroupComponents => {
  const groupComponent = createGroupComponent();
  groupComponent.topPointer = topPointer;
  registerComponent(state, groupComponent);

  components.forEach((v) => {
    moveComponentTo(state, v, groupComponent.id);
  });

  if (topPointer !== COMPONENT_TOP_POINTER) {
    const __component = state.components.byId[topPointer] as GroupComponents;
    __component.components.push(groupComponent.id);
    __component.components = __component.components.filter(
      (v) => !components.includes(v)
    );
  }

  return groupComponent;
};

export const mergeComponentsToExistGroupAndGet = (
    state: WritableDraft<PrismState>,
    groupComponentId: string,
    singleComponentIds: string[]
): GroupComponents | undefined => {
    const __groupComponents = state.components.byId[groupComponentId] as GroupComponents;
    singleComponentIds.forEach(id => {
        moveComponentTo(state, id, groupComponentId);
    })
    return __groupComponents;
}
