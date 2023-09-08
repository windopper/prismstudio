import useCurrentElementStateIfPresent from "prism/hooks/useCurrentElementStateIfPresent";
import StatusPosition from "./StatusPosition";
import StatusRotation from "./StatusRotation";
import StatusScale from "./StatusScale";

export function getRegex() {
  return /^(-?([1-9]{1}\d{0,2}|0{1}))(\.{1}\d{1,3})?$/g;
}

const StatusItem = () => {
  const elementStates = useCurrentElementStateIfPresent();

  return (
    <div className="flex flex-col">
      {/* <div>component-{id}</div> */}
      {elementStates && (
        <>
          <StatusPosition elementStates={elementStates} />
          <StatusRotation elementStates={elementStates} />
          <StatusScale elementStates={elementStates} />
        </>
      )}
    </div>
  );
};

export default StatusItem;
