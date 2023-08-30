import {
  GroupComponents,
  PrismNormalizedComponentState,
  SingleComponent,
} from "../prismSlice";

export function getChildElementIdsFromComponents(
  components: (GroupComponents | SingleComponent)[],
  componentStates: PrismNormalizedComponentState
): string[] {
  let elementIds: string[] = [];

  while (components.length !== 0) {
    let newComponents: (GroupComponents | SingleComponent)[] = [];

    for (let component of components) {
      const { type } = component;

      if (type === "GroupComponents") {
        component = component as GroupComponents;
        for (let componentId of component.components) {
          newComponents.push(componentStates.byId[componentId]);
        }
      } else {
        component = component as SingleComponent;
        elementIds.push(component.elementState);
      }
    }

    components = newComponents;
  }

  return elementIds;
}

export function getChildComponentIdsFromComponent(
  component: (GroupComponents | SingleComponent),
  componentStates: PrismNormalizedComponentState
): { singleComponentIds: string[], groupComponentIds: string[] } {
  let singleComponentIds: string[] = [];
  let groupComponentIds: string[] = [];

  let components = [component];
  while (components.length !== 0) {
    let newComponents: (GroupComponents | SingleComponent)[] = [];

    for (let component of components) {
      const { type } = component;

      if (type === "GroupComponents") {
        component = component as GroupComponents;
        groupComponentIds.push(component.id);
        for (let componentId of component.components) {
          newComponents.push(componentStates.byId[componentId]);
        }
      } else {
        component = component as SingleComponent;
        singleComponentIds.push(component.id);
      }
    }
  }

  return {
    singleComponentIds,
    groupComponentIds
  }
}
