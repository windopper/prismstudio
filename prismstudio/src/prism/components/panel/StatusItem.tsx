import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { updateElementStates } from "../../redux/prismSlice";

interface Props {
  id: string,
  position: [x: number, y: number, z: number],
  rotate: [x: number, y: number, z: number],
  scale: [x: number, y: number, z: number]
}

const StatusItem = ({id, position, rotate, scale}: Props) => {
  const positionRefs = useRef<any>([]);
  const rotateRefs = useRef<any>([]);
  const scaleRefs = useRef<any>([]);
  const dispatch = useDispatch();

  const updateState = () => {
    const position: [x: number, y: number, z: number] = [0, 0, 0];
    const rotate: [x: number, y: number, z: number] = [0, 0, 0];
    const scale: [x: number, y: number, z: number] = [0, 0, 0];

    positionRefs.current.map((v: any, i: number) => {
      position[i] = v.value;
    })

    dispatch(updateElementStates([{
      elementId: id,
      position: position,
      rotate: rotate,
      scale: scale
    }]));
  }


  return (
    <div className="flex flex-col">
      <div>component-{id}</div>
      <div className="flex flex-row m-1">
        {position.map((v, i) => (
          <div className="w-1/3 flex justify-center">
            <input className="relative w-full bg-transparent 
            outline-none text-center" value={v} key={i} onChange={updateState} 
            ref={(el) => positionRefs.current[i] = el}
          />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        <AttributeTitle>회전</AttributeTitle>
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
