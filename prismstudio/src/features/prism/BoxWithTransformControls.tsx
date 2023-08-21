import { TransformControls, useHelper } from "@react-three/drei";
import React, { forwardRef, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { BoxHelper, Color, Event, Mesh, Vector3 } from "three";
import { focusComponent, updateFocusedComponentPosition } from "./prismSlice";
import { toggleOrbitControl } from "./prismSlice";

const TRANSLATION_SNAP = 0.0625

interface Prop {
  id: number;
  enableTransformControl: boolean;
  transformControlsMode: any;
}

const BoxWithTransformControls = React.memo((props: Prop) => {
  const { id, enableTransformControl, transformControlsMode } = props;
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
        <BoxMesh id={id} ref={boxRef} />
      </TransformControls>
    </>
  );
});

const BoxMesh = forwardRef(({ id }: any, ref: any) => {
  const dispatch = useDispatch();
  const onFocus = useCallback(() => {
    dispatch(focusComponent({ id }));
  }, [dispatch, id]);

  useHelper(ref, BoxHelper, Color.NAMES.gray);

  return (
    <mesh onClick={onFocus} ref={ref} position={[0.5, 0.5, 0.5]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={"yellow"} />
    </mesh>
  );
});

export default BoxWithTransformControls;
