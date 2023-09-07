import { TransformControls } from "@react-three/drei";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Mesh } from "three";
import { RootState } from "store";
import useTransformControls from "prism/hooks/useTransformControls";
import useTransformControlEvent from "prism/hooks/useTransformControlEvent";
import { TRANSLATION_SNAP } from "prism/constants";
import { useThree } from "@react-three/fiber";

export interface PrismTransformControlsProps {
  elementRefs: React.MutableRefObject<Map<string, Mesh>>;
}

const PrismTransformControls = React.memo(
  (props: PrismTransformControlsProps) => {
    const { elementRefs } = props;
    const controlRef = useRef<any>();
    const { scene } = useThree();

    const { transformControlsMode } = useSelector(
      (state: RootState) => state.prismSlice
    );

    const transformControls = useTransformControls(elementRefs);
    const {
      stopOrbitControls,
      startOrbitControls,
      onChange,
      onDraggingChanged,
    } = useTransformControlEvent(elementRefs);

    useEffect(() => {
      if (transformControls === undefined) return;
      
      transformControls?.addEventListener('dragging-changed', onDraggingChanged);
      return () => {
        transformControls?.removeEventListener('dragging-changed', onDraggingChanged);
      }
    }, [transformControls]);

    return null;
  }
);

export default PrismTransformControls;
