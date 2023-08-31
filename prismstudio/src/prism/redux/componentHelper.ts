import { WritableDraft } from "immer/dist/internal";
import { GroupComponents, PrismState, SingleComponent } from "./prismSlice";

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
  state.components.allIds = state.components.allIds.filter(
    (v) => v !== componentId
  );
  delete state.components.byId[componentId];
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
