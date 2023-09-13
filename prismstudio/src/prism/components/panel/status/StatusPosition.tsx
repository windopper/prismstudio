import { useEffect, useRef, useState } from "react";
import AttributeContainer from "./AttributeContainer";
import AttributeTitle from "./AttributeTitle";
import PanelInput from "./PanelInput";
import { getRegex } from "./StatusItem";
import { useDispatch } from "react-redux";
import { ElementState, setTransformControlsState, updateElementStates } from "prism/redux/prismSlice";
import AttributeInputContainer from "./AttributeInputContainer";

interface Props {
  elementStates: ElementState;
}

const StatusPosition = ({ elementStates }: Props) => {
  const positionRefs = useRef<HTMLInputElement[]>([]);
  const [isValueInValid, setIsValueInValid] = useState<boolean>(false);
  const dispatch = useDispatch();

  const { id, position, rotate, scale } = elementStates;

  useEffect(() => {
    if (isValueInValid) return;
    for (let i = 0; i < 3; i++) {
      positionRefs.current[i].value = position[i].toString();
    }
  }, [position, isValueInValid]);

  const updateState = () => {
    const position: [x: number, y: number, z: number] = [0, 0, 0];
    for (const p of positionRefs.current.map((v) => v.value)) {
      if (getRegex().test(p)) continue;
      setIsValueInValid(true);
      return;
    }

    positionRefs.current.forEach((v, i) => {
      position[i] = parseFloat(v.value);
    });

    dispatch(
      setTransformControlsState({
        transformControlsState: {
          position: position,
          rotate: rotate,
          scale: scale,
        },
      })
    );

    // dispatch(
    //   updateElementStates([
    //     {
    //       elementId: id,
    //       position: position,
    //       rotate: rotate,
    //       scale: scale,
    //     },
    //   ])
    // );

    setIsValueInValid(false);
  };

  return (
    <AttributeContainer className="bg-[#2a2a2a]">
      <AttributeTitle>위치</AttributeTitle>
      <AttributeInputContainer isValueInValid={isValueInValid}>
        {position.map((_, i) => (
          <PanelInput
            updateState={updateState}
            onBlur={() => setIsValueInValid(false)}
            key={i}
            ref={(el) => (positionRefs.current[i] = el as HTMLInputElement)}
          />
        ))}
      </AttributeInputContainer>
    </AttributeContainer>
  );
};

export default StatusPosition;
