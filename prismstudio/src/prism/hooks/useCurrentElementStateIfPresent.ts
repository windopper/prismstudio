import { ElementState, SingleComponent } from "prism/redux/prismSlice";
import { useSelector } from "react-redux";
import { RootState } from "store";

const useCurrentElementStateIfPresent = (): ElementState | undefined => {
    const elementStates: ElementState | undefined = useSelector((state: RootState) => {
        const focusOn = state.prismSlice.focusOn;
        if (focusOn.length !== 1) return;
        const component = state.prismSlice.components.byId[focusOn[0]];
        if (component.type === "SingleComponent") {
          return state.prismSlice.elementStates.byId[
            (component as SingleComponent).elementState
          ];
        }
    });

    return elementStates;
}

export default useCurrentElementStateIfPresent;