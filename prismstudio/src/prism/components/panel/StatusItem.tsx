import React, { forwardRef, useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { updateElementStates } from "../../redux/prismSlice";

interface Props {
  id: string;
  position: [x: number, y: number, z: number];
  rotate: [x: number, y: number, z: number];
  scale: [x: number, y: number, z: number];
}

function getRegex() {
  return /^(-?([1-9]{1}\d{0,2}|0{1}))(\.{1}\d{1,3})?$/g;
}

const StatusItem = ({ id, position, rotate, scale }: Props) => {
  const positionRefs = useRef<HTMLInputElement[]>([]);
  const rotateRefs = useRef<HTMLInputElement[]>([]);
  const scaleRefs = useRef<HTMLInputElement[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    for (let i = 0; i < 3; i++) {
      positionRefs.current[i].value = position[i].toString();
    }
  }, [position]);

  useEffect(() => {
    for (let i = 0; i < 3; i++) {
      rotateRefs.current[i].value = rotate[i].toString();
    }
  }, [rotate]);

  // useEffect(() => {
  //   for (let i = 0; i < 3; i++) {
  //     scaleRefs.current[i].value = scale[i].toString();
  //   }
  // }, [scale]);

  const updateState = () => {
    const position: [x: number, y: number, z: number] = [0, 0, 0];
    const rotate: [x: number, y: number, z: number] = [0, 0, 0];
    const scale: [x: number, y: number, z: number] = [0, 0, 0];

    for (let p of positionRefs.current.map((v) => v.value)) {
      if (getRegex().test(p)) continue;
      return;
    }

    for (let r of rotateRefs.current.map((v) => v.value)) {
      if (getRegex().test(r)) continue;
      return;
    }

    // for (let s of scaleRefs.current.map((v) => v.value)) {
    //   if (!getRegex().test(s)) continue;
    //   return;
    // }

    positionRefs.current.forEach((v: any, i: number) => {
      position[i] = parseFloat(v.value);
    });

    rotateRefs.current.forEach((v, i) => {
      rotate[i] = parseFloat(v.value);
    });

    // scaleRefs.current.forEach((v, i) => {
    //   scale[i] = parseFloat(v.value);
    // });

    dispatch(
      updateElementStates([
        {
          elementId: id,
          position: position,
          rotate: rotate,
          scale: scale,
        },
      ])
    );
  };

  return (
    <div className="flex flex-col">
      <div>component-{id}</div>
      <div className="flex flex-row m-1">
        {position.map((v, i) => (
          <div className="w-1/3 flex justify-center">
            <input
              className="relative w-full bg-transparent 
            outline-none text-center"
              key={i}
              ref={(el) => (positionRefs.current[i] = el as HTMLInputElement)}
              onInput={updateState}
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
            <Slider
              onChange={updateState}
              ref={(el) => (rotateRefs.current[i] = el as HTMLInputElement)}
            />
          </div>
        ))}
      </div>
      <div>{scale}</div>
      <div className="flex flex-row"></div>
    </div>
  );
};

const AttributeTitle = ({ children }: React.HTMLAttributes<unknown>) => {
  return <div className="text-green-100 text-lg text">{children}</div>;
};

const Slider = forwardRef(({ onChange }: any, ref: any) => {
  return (
    <input
      type="range"
      min="-3.14"
      max="3.14"
      step={0.01}
      className="slider flex-initial w-4/5"
      onChange={onChange}
      ref={ref}
    />
  );
});

export default StatusItem;
