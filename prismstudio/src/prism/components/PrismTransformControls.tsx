import { TransformControls } from "@react-three/drei";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import { Mesh } from "three";
import { RootState } from "../../store";
import useGroupFocusedElements from "../hooks/useGroupFocusedElements";
import useTransformControlEvent from "../hooks/useTransformControlEvent";
import { TRANSLATION_SNAP } from "../constants";

export interface PrismTransformControlsProps {
  elementRefs: React.MutableRefObject<Map<string, Mesh>>;
}

const PrismTransformControls = React.memo(
  (props: PrismTransformControlsProps) => {
    const { elementRefs } = props;
    const controlRef = useRef<any>();

    const { transformControlsMode } = useSelector(
      (state: RootState) => state.prismSlice
    );

    const { wrapperGroup } = useGroupFocusedElements(elementRefs);
    const {
      stopOrbitControls,
      startOrbitControls,
      onChange,
      onDraggingChanged,
    } = useTransformControlEvent(elementRefs);

    return (
      <>
        {wrapperGroup !== undefined &&
          wrapperGroup.userData.elementSize === 1 && (
            <TransformControls
              onMouseDown={stopOrbitControls}
              onMouseUp={startOrbitControls}
              size={1}
              // onUpdate={console.log}
              //onChange={console.log}
              //onUpdate={console.log}
              translationSnap={TRANSLATION_SNAP}
              rotationSnap={30 * 0.0174533}
              scaleSnap={1}
              mode={transformControlsMode}
              ref={controlRef}
              position={[1, 1, 1]}
              object={wrapperGroup}
            />
          )}
      </>
    );
  }
);

export default PrismTransformControls;
