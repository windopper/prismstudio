import { GroupComponents, PrismNormalizedComponentState, SingleComponent } from "../prismSlice";

export function getElementIdsFromComponents(components: (GroupComponents | SingleComponent)[], componentStates: PrismNormalizedComponentState): string[] {
    let ret: string[] = [];
    
    while(components.length !== 0) {
        let newComponents: (GroupComponents | SingleComponent)[] = [];

        for (let component of components) {
            const { type } = component;

            if (type === 'GroupComponents') {
                component = component as GroupComponents;
                for (let componentId of component.components) {
                    newComponents.push(componentStates.byId[componentId]);
                }
            }
            else {
                component = component as SingleComponent;
                ret.push(component.elementState);
            }
        }

        components = newComponents;
    }

    return ret;
}