import { TransformControls, useHelper } from "@react-three/drei";
import React, { forwardRef, useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { BoxHelper, Color, Event, Mesh, Vector3 } from "three";
import { focusComponent, updateFocusedComponentPosition } from "./prismSlice";
import { toggleOrbitControl } from "./prismSlice";

interface Prop {
  id: number;
  enableTransformControl: boolean;
}

const BoxWithTransformControls = React.memo((props: Prop) => {
  const { id, enableTransformControl } = props;
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
    parent?.matrixWorld.setPosition(new Vector3(1, 1, 1));
    console.log(parent);
    dispatch(updateFocusedComponentPosition({position}))
  }

  const callback = (e: Event | undefined) => {
    console.log(boxRef.current.parent?.position)
  }

  return (
    <>
      <TransformControls
        size={enableTransformControl ? 1 : 0}
        onMouseDown={stopOrbitControls}
        onMouseUp={startOrbitControls}
        onChange={updatePosition}
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
    <mesh onClick={onFocus} ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial transparent={true} opacity={0} />
    </mesh>
  );
});

export default BoxWithTransformControls;
