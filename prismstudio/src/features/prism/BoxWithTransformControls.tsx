import { TransformControls, useHelper } from "@react-three/drei";
import React, { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BoxHelper, Color, Event, Mesh, Vector3 } from "three";
import { focusComponent, updateFocusedComponentPosition } from "./prismSlice";
import { toggleOrbitControl } from "./prismSlice";
import { RootState } from "../../store";
import BoxMesh from "./BoxMesh";

const TRANSLATION_SNAP = 0.03125

interface Prop {
  id: number;
  //position: number[]
  enableTransformControl: boolean;
  transformControlsMode: any;
  isGrouped: boolean,
}

// TODO 단일 컴포넌트 목적이 아닌 그룹 컴포넌트도 사용할 수 있도록 children prop을 사용해야함
const BoxWithTransformControls = React.memo((props: Prop) => {
  const { id, enableTransformControl, transformControlsMode, isGrouped } = props;
  const dispatch = useDispatch();
  const boxRef = useRef<Mesh>(null!);
  const controlRef = useRef<any>();

  const stopOrbitControls = useCallback(() => {
    dispatch(toggleOrbitControl(false));
  }, [dispatch]);

  const startOrbitControls = useCallback(() => {
    dispatch(toggleOrbitControl(true));
  }, [dispatch]);

  const updatePosition = (e: Event | undefined) => {
    const parent = boxRef.current.parent;
    const vector3: Vector3 = parent?.position!;
    const position: number[] = [vector3.x, vector3.y, vector3.z]
    dispatch(updateFocusedComponentPosition({position}))
  }

  return (
    <>
      <TransformControls
        size={enableTransformControl ? 1 : 0}
        onMouseDown={stopOrbitControls}
        onMouseUp={startOrbitControls}
        onChange={updatePosition}
        translationSnap={TRANSLATION_SNAP}
        mode={transformControlsMode}
        ref={controlRef}
      >
        <BoxMesh id={id} isGrouped={isGrouped} ref={boxRef} />
      </TransformControls>
    </>
  );
});



export default BoxWithTransformControls;
