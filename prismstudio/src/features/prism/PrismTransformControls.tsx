import { TransformControls } from "@react-three/drei";
import React, { useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { Event } from "three";
import {
  toggleOrbitControl,
} from "./prismSlice";

const TRANSLATION_SNAP = 0.03125;

export interface PrismTransformControlsProps {
  enableTransformControl?: boolean;
  transformControlsMode?: any;
  children?: any;
  onUpdate?: (e: Event | undefined) => void;
}

const PrismTransformControls = React.memo(
  (props: PrismTransformControlsProps) => {
    const {
      enableTransformControl,
      transformControlsMode,
      children,
      onUpdate,
    } = props;
    const dispatch = useDispatch();
    const controlRef = useRef<any>();

    const stopOrbitControls = useCallback(() => {
      dispatch(toggleOrbitControl(false));
    }, [dispatch]);

    const startOrbitControls = useCallback(() => {
      dispatch(toggleOrbitControl(true));
    }, [dispatch]);

    return (
      <>
        <TransformControls
          size={enableTransformControl ? 1 : 0}
          onMouseDown={stopOrbitControls}
          onMouseUp={startOrbitControls}
          onChange={onUpdate}
          translationSnap={TRANSLATION_SNAP}
          mode={transformControlsMode}
          ref={controlRef}
        >
          {children}
        </TransformControls>
      </>
    );
  }
);

export default PrismTransformControls;
