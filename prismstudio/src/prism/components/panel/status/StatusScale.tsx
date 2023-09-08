import React, { useEffect, useRef, useState } from "react";
import AttributeContainer from "./AttributeContainer";
import AttributeTitle from "./AttributeTitle";
import PanelInput from "./PanelInput";
import useCurrentElementStateIfPresent from "prism/hooks/useCurrentElementStateIfPresent";
import { getRegex } from "./StatusItem";
import { useDispatch } from "react-redux";
import { ElementState, updateElementStates } from "prism/redux/prismSlice";
import AttributeInputContainer from "./AttributeInputContainer";

interface Props {
  elementStates: ElementState;
}

const StatusScale = ({ elementStates }: Props) => {
  const scaleRefs = useRef<HTMLInputElement[]>([]);
  const [isValueInValid, setIsValueInValid] = useState<boolean>(false);
  const dispatch = useDispatch();

  const { id, position, rotate, scale } = elementStates;

  useEffect(() => {
    if (isValueInValid) return;
    for (let i = 0; i < 3; i++) {
      scaleRefs.current[i].value = scale[i].toString();
    }
  }, [scale, isValueInValid]);

  const updateState = () => {
    const scale: [x: number, y: number, z: number] = [0, 0, 0];
    for (const p of scaleRefs.current.map((v) => v.value)) {
      if (getRegex().test(p)) continue;
      setIsValueInValid(true);
      return;
    }

    scaleRefs.current.forEach((v, i) => {
      scale[i] = parseFloat(v.value);
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
    setIsValueInValid(false);
  };

  return (
    <AttributeContainer className="bg-[#2a2a2a]">
      <AttributeTitle>스케일</AttributeTitle>
      <AttributeInputContainer isValueInValid={isValueInValid}>
        {scale.map((_, i) => (
          <PanelInput
            updateState={updateState}
            onBlur={() => setIsValueInValid(false)}
            key={i}
            ref={(el) => (scaleRefs.current[i] = el as HTMLInputElement)}
          />
        ))}
      </AttributeInputContainer>
    </AttributeContainer>
  );
};

export default StatusScale;
