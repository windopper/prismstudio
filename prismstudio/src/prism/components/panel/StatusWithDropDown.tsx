import DropDown from "./DropDown";
import StatusItem from "./StatusItem";
import { useSelector } from "react-redux";
import { SingleComponent } from "../../redux/prismSlice";
import { RootState } from "../../../store";

export default function StatusWithDropDown() {
  const elementStates = useSelector((state: RootState) => {
    const focusOn = state.prismSlice.focusOn;
    if (focusOn.length !== 1) return;
    const component = state.prismSlice.components.byId[focusOn[0]];
    if (component.type === "SingleComponent") {
      return state.prismSlice.elementStates.byId[
        (component as SingleComponent).elementState
      ];
    }
  });

  return (
    <DropDown dropDownName="상태" defaultOpenState={true}>
      {elementStates && <StatusItem {...elementStates} />}
    </DropDown>
  );
}
