import React, { useEffect, useRef } from "react";
import AttributeContainer from "./AttributeContainer";
import AttributeTitle from "./AttributeTitle";
import PanelInput from "./PanelInput";
import useCurrentElementStateIfPresent from "prism/hooks/useCurrentElementStateIfPresent";
import { getRegex } from "./StatusItem";
import { useDispatch } from "react-redux";
import { ElementState, updateElementStates } from "prism/redux/prismSlice";

interface Props {
  elementStates: ElementState;
}

const StatusScale = ({ elementStates }: Props) => {
  const scaleRefs = useRef<HTMLInputElement[]>([]);
  const dispatch = useDispatch();

  const { id, position, rotate, scale } = elementStates;

  useEffect(() => {
    for (let i = 0; i < 3; i++) {
      scaleRefs.current[i].value = scale[i].toString();
    }
  }, [scale]);

  const updateState = () => {
    const scale: [x: number, y: number, z: number] = [0, 0, 0];
    for (const p of scaleRefs.current.map((v) => v.value)) {
      if (getRegex().test(p)) continue;
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
  };

  return (
    <AttributeContainer className="bg-[#2a2a2a]">
      <AttributeTitle>스케일</AttributeTitle>
      <div className="flex flex-row m-1">
        {scale.map((_, i) => (
          <PanelInput
            updateState={updateState}
            key={i}
            ref={(el) => (scaleRefs.current[i] = el as HTMLInputElement)}
          />
        ))}
      </div>
    </AttributeContainer>
  );
};

export default StatusScale;
