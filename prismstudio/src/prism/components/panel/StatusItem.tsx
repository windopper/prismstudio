import React from "react";

interface Props {
  id: string,
  position: [x: number, y: number, z: number],
  rotate: [x: number, y: number, z: number],
  scale: [x: number, y: number, z: number]
}

const StatusItem = ({id, position, rotate, scale}: Props) => {
  return (
    <div className="flex flex-col">
      <div>component-{id}</div>
      <div className="flex flex-row m-1">
        {position.map((v, i) => (
          <div className="w-1/3 flex justify-center">
            <input className="relative w-full bg-transparent outline-none text-center" value={v} key={i} onChange={console.log} />
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
