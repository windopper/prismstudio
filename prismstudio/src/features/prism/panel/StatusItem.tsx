import { Component } from "../prismSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

interface Prop {
  focusedComponent: Component;
}

const StatusItem = (props: Prop) => {
  const { focusedComponent } = props;
  const elementStates = useSelector((state: RootState) => {
    return state.prismSlice.elementStates.filter(v => v.currentComponentId === focusedComponent.id);
  })
  return (
    <div className="flex flex-row items-center">
        {elementStates.map(v => (
            <div className="flex flex-col">
                <div>component-{v.id}</div>
                <div>{v.position}</div>
                <div>{v.rotate}</div>
                <div>{v.scale}</div>
                <div className="flex flex-row">
                    
                </div>
            </div>
        ))}
    </div>
  );
};

export default StatusItem;
