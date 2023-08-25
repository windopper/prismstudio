import { TransformControls } from "@react-three/drei";
import React, { forwardRef, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { Event } from "three";
import {
  toggleOrbitControl,
} from "./prismSlice";

const TRANSLATION_SNAP = 0.03125;

export interface PrismTransformControlsProps {
  focusOn: number | undefined,
  transformControlsMode?: any,
  onUpdate?: (e: Event | undefined) => void,
}

const PrismTransformControls = React.memo(forwardRef(
  (props: PrismTransformControlsProps, ref: any) => {
    const {
      focusOn,
      transformControlsMode,
      onUpdate,
    } = props;
    const dispatch = useDispatch();

    console.log('update')

    const stopOrbitControls = useCallback(() => {
      dispatch(toggleOrbitControl(false));
    }, [dispatch]);

    const startOrbitControls = useCallback(() => {
      dispatch(toggleOrbitControl(true));
    }, [dispatch]);

    return (
      <>
      {focusOn != undefined ?
        <TransformControls
          onMouseDown={stopOrbitControls}
          onMouseUp={startOrbitControls}
          // onUpdate={console.log}
          //onChange={console.log}
          translationSnap={TRANSLATION_SNAP}
          mode={transformControlsMode}
          ref={ref}
        /> : null}</>
    );
  }
));

export default PrismTransformControls;
