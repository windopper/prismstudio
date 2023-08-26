import { TransformControls } from "@react-three/drei";
import React, { useCallback } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Event, Mesh } from "three";
import {
  toggleOrbitControl,
} from "./prismSlice";
import { RootState } from "../../store";
import useChangeFocusComponent from "./hooks/useChangeFocusComponent";

const TRANSLATION_SNAP = 0.03125;

export interface PrismTransformControlsProps {
  elementRefs: React.MutableRefObject<Map<number, Mesh>>,
  onUpdate?: (e: Event | undefined) => void,
}

const PrismTransformControls = React.memo(
  (props: PrismTransformControlsProps) => {
    const {
      elementRefs,
      onUpdate,
    } = props;

    const dispatch = useDispatch();

    const { transformControlsMode, focusOn, focusedComponent } = useSelector((state: RootState) => {
      const { transformControlsMode, focusOn } = state.prismSlice;
      const focusedComponent = state.prismSlice.components.find(v => v.id === focusOn);
      return {
        transformControlsMode,
        focusOn,
        focusedComponent,
      }
    })

    const { controlRef } = useChangeFocusComponent(focusOn, focusedComponent, elementRefs)

    const stopOrbitControls = useCallback(() => {
      dispatch(toggleOrbitControl(false));
    }, [dispatch]);

    const startOrbitControls = useCallback(() => {
      dispatch(toggleOrbitControl(true));
    }, [dispatch]);

    return (
      <>
      {focusOn !== undefined ?
        <TransformControls
          onMouseDown={stopOrbitControls}
          onMouseUp={startOrbitControls}
          // onUpdate={console.log}
          //onChange={console.log}
          onUpdate={console.log}
          translationSnap={TRANSLATION_SNAP}
          mode={transformControlsMode}
          ref={controlRef}
        /> : null}</>
    );
  }
);

export default PrismTransformControls;

