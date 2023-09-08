import { useEffect, useRef } from "react";
import AttributeContainer from "./AttributeContainer";
import AttributeTitle from "./AttributeTitle";
import PanelInput from "./PanelInput";
import { getRegex } from "./StatusItem";
import { useDispatch } from "react-redux";
import { ElementState, updateElementStates } from "prism/redux/prismSlice";
import PanelSlider from "./PanelSlider";

interface Props {
  elementStates: ElementState;
}

const StatusRotation = ({ elementStates }: Props) => {
  const rotateInputRefs = useRef<HTMLInputElement[]>([]);
  const rotateRangeRefs = useRef<HTMLInputElement[]>([]);
  const dispatch = useDispatch();

  const { id, position, rotate, scale } = elementStates;

  useEffect(() => {
    for (let i = 0; i < 3; i++) {
      rotateRangeRefs.current[i].value = rotate[i].toString();
      rotateInputRefs.current[i].value = rotate[i].toString();
    }
  }, [rotate]);

  const updateStateOnRangeChanged = () => {
    const rotation: [x: number, y: number, z: number] = [0, 0, 0];

    for (let r of rotateRangeRefs.current.map((v) => v.value)) {
      if (getRegex().test(r)) continue;
      return;
    }

    rotateRangeRefs.current.forEach((v, i) => {
      rotation[i] = parseFloat(v.value);
    });

    dispatch(
      updateElementStates([
        {
          elementId: id,
          position: position,
          rotate: rotation,
          scale: scale,
        },
      ])
    );
  };

  const updateStateOnInputChanged = () => {
    const rotation: [x: number, y: number, z: number] = [0, 0, 0];

    for (let r of rotateInputRefs.current.map((v) => v.value)) {
      if (getRegex().test(r)) {
        if (-3.14 <= parseFloat(r) && parseFloat(r) <= 3.14) continue;
      }
      
      return;
    }

    rotateInputRefs.current.forEach((v, i) => {
      rotation[i] = parseFloat(v.value);
    });

    dispatch(
      updateElementStates([
        {
          elementId: id,
          position: position,
          rotate: rotation,
          scale: scale,
        },
      ])
    );
  };

  return (
    <AttributeContainer className="bg-[#2a2a2a]">
      <AttributeTitle>회전</AttributeTitle>
      {rotate.map((v, i) => (
        <div className="flex flex-row items-center" key={i}>
          <PanelInput
            updateState={updateStateOnInputChanged}
            key={i}
            ref={(el) => (rotateInputRefs.current[i] = el as HTMLInputElement)}
          />
          <PanelSlider
            updateState={updateStateOnRangeChanged}
            ref={(el) => (rotateRangeRefs.current[i] = el as HTMLInputElement)}
          />
        </div>
      ))}
    </AttributeContainer>
  );
};

export default StatusRotation;
