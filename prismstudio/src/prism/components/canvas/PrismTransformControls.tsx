import { TransformControls } from "@react-three/drei";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Mesh } from "three";
import { RootState } from "store";
import useGroupFocusedElements from "prism/hooks/useGroupFocusedElements";
import useTransformControlEvent from "prism/hooks/useTransformControlEvent";
import { TRANSLATION_SNAP } from "prism/constants";

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

    useEffect(() => {
      const transformControls = controlRef.current;
      if (transformControls === undefined) return;
      transformControls?.addEventListener('dragging-changed', onDraggingChanged);
      return () => {
        transformControls?.removeEventListener('dragging-changed', onDraggingChanged);
      }
    }, [wrapperGroup]);

    return (
      <>
        {wrapperGroup !== undefined &&
          wrapperGroup.userData.elementSize === 1 && (
            <TransformControls
              onMouseDown={stopOrbitControls}
              onMouseUp={startOrbitControls}
              size={1}
              translationSnap={TRANSLATION_SNAP}
              rotationSnap={30 * 0.0174533}
              scaleSnap={1}
              mode={transformControlsMode}
              ref={controlRef}
              object={wrapperGroup}
            />
          )}
      </>
    );
  }
);

export default PrismTransformControls;
