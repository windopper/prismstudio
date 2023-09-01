import { SingleComponent } from "../../redux/prismSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import React from "react";

const StatusItem = () => {
  const elementStates = useSelector((state: RootState) => {
    const focusOn = state.prismSlice.focusOn;
    if (focusOn.length !== 1) return;
    const component = state.prismSlice.components.byId[focusOn[0]];
    if (component.type === 'SingleComponent') {
      return state.prismSlice.elementStates.byId[(component as SingleComponent).elementState];
    }
  })

  if (elementStates === undefined) return null;

  const { id, position, rotate, scale } = elementStates;

  return (
    <div className="flex flex-col">
      <div>component-{id}</div>
      <div>{position}</div>
      <div className="flex flex-col gap-1">
        <AttributeTitle>위치</AttributeTitle>
        {rotate.map((v, i) => (
          <div className="flex flex-row" key={i}>
            <div className="flex flex-row justify-center items-center flex-initial w-1/5 text-pink-700 text-xl">
              {v}
            </div>
            <Slider />
          </div>
        ))}
      </div>
      <div>{scale}</div>
      <div className="flex flex-row"></div>
    </div>
  );
};

const AttributeTitle = ({children}: React.HTMLAttributes<unknown>) => {
  return (
    <div className="text-green-100 text-lg text">{children}</div>
  )
}

const Slider = () => {
  return (
    <input type="range" min="1" max="100" className="slider flex-initial w-4/5" />
  )
}

export default StatusItem;
