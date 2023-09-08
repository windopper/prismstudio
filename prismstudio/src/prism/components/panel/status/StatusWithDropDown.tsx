import DropDown from "prism/components/panel/DropDown";
import StatusItem from "./StatusItem";
import { useDispatch } from "react-redux";
import useCurrentElementStateIfPresent from "prism/hooks/useCurrentElementStateIfPresent";

export default function StatusWithDropDown() {
  const elementStates = useCurrentElementStateIfPresent();

  return (
    <DropDown dropDownName="상태" defaultOpenState={true}>
      {elementStates && <StatusItem />}
    </DropDown>
  );
}
