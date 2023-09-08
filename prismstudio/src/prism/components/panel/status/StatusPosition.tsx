import { useEffect, useRef } from "react";
import AttributeContainer from "./AttributeContainer";
import AttributeTitle from "./AttributeTitle";
import PanelInput from "./PanelInput";
import { getRegex } from "./StatusItem";
import { useDispatch } from "react-redux";
import { ElementState, updateElementStates } from "prism/redux/prismSlice";

interface Props {
  elementStates: ElementState;
}

const StatusPosition = ({ elementStates }: Props) => {
  const positionRefs = useRef<HTMLInputElement[]>([]);
  const dispatch = useDispatch();

  const { id, position, rotate, scale } = elementStates;

  useEffect(() => {
    for (let i = 0; i < 3; i++) {
      positionRefs.current[i].value = position[i].toString();
    }
  }, [position]);

  const updateState = () => {
    const position: [x: number, y: number, z: number] = [0, 0, 0];
    for (const p of positionRefs.current.map((v) => v.value)) {
      if (getRegex().test(p)) continue;
      return;
    }

    positionRefs.current.forEach((v, i) => {
      position[i] = parseFloat(v.value);
    });

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
    <AttributeContainer className="bg-[#2a2a2a]">
      <AttributeTitle>위치</AttributeTitle>
      <div className="flex flex-row m-1">
        {position.map((_, i) => (
          <PanelInput
            updateState={updateState}
            key={i}
            ref={(el) => (positionRefs.current[i] = el as HTMLInputElement)}
          />
        ))}
      </div>
    </AttributeContainer>
  );
};

export default StatusPosition;
