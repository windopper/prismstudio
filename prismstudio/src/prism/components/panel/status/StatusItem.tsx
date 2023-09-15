import useCurrentElementStateIfPresent from "prism/hooks/useCurrentElementStateIfPresent";
import StatusPosition from "./StatusPosition";
import StatusRotation from "./StatusRotation";
import StatusScale from "./StatusScale";
import { useSelector } from "react-redux";
import { RootState } from "store";

export function getRegex() {
  return /^(-?([1-9]{1}\d{0,2}|0{1}))(\.{1}\d{1,3})?$/g;
}

const StatusItem = () => {
  const elementStates = useCurrentElementStateIfPresent();
  const { transformControlsState } = useSelector((state: RootState) => state.prismSlice)

  return (
    <div className="flex flex-col">
      {/* <div>component-{id}</div> */}
      {elementStates && (
        <>
          {transformControlsState && <StatusPosition transformControlsState={transformControlsState} />}
          <StatusRotation elementStates={elementStates} />
          <StatusScale elementStates={elementStates} />
        </>
      )}
    </div>
  );
};

export default StatusItem;
