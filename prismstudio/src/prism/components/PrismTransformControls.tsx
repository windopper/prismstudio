import { TransformControls } from "@react-three/drei";
import React, { useCallback } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Event, Mesh } from "three";
import {
  toggleOrbitControl,
} from "../redux/prismSlice";
import { RootState } from "../../store";
import useChangeFocusComponent from "../hooks/useChangeFocusComponent";

const TRANSLATION_SNAP = 0.03125;

export interface PrismTransformControlsProps {
  elementRefs: React.MutableRefObject<Map<string, Mesh>>,
  onUpdate?: (e: Event | undefined) => void,
}

const PrismTransformControls = React.memo(
  (props: PrismTransformControlsProps) => {
    const {
      elementRefs,
      onUpdate,
    } = props;

    const dispatch = useDispatch();

    const { transformControlsMode } = useSelector((state: RootState) => state.prismSlice);

    const { controlRef } = useChangeFocusComponent(elementRefs)

    const stopOrbitControls = useCallback(() => {
      dispatch(toggleOrbitControl(false));
    }, [dispatch]);

    const startOrbitControls = useCallback(() => {
      dispatch(toggleOrbitControl(true));
    }, [dispatch]);

    return (
      <>
        <TransformControls
          onMouseDown={stopOrbitControls}
          onMouseUp={startOrbitControls}
          size={0.5}
          // onUpdate={console.log}
          //onChange={console.log}
          //onUpdate={console.log}

          translationSnap={TRANSLATION_SNAP}
          rotationSnap={30 * 0.0174533}
          scaleSnap={1}
          mode={transformControlsMode}
          ref={controlRef}
        /></>
      // {focusOn.length === 1 ?
    );
  }
);

export default PrismTransformControls;

