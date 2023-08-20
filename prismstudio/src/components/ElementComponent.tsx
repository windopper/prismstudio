import { TransformControls, useHelper } from "@react-three/drei";
import React, { useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { BoxHelper, Color, Mesh } from "three";
import { focusComponent } from "../features/prism/prismSlice";
import { toggleOrbitControl } from "../features/global/globalSlice";

interface Prop {
  id: number;
  isFocusOn: boolean;
}

const ElementComponent = React.memo((props: Prop) => {
  const { id, isFocusOn } = props;
  const dispatch = useDispatch();

  const stopOrbitControls = useCallback(() => {
    dispatch(toggleOrbitControl(false));
  }, [dispatch]);

  const startOrbitControls = useCallback(() => {
    dispatch(toggleOrbitControl(true));
  }, [dispatch]);

  return (
    <>
      <TransformControls
        visible={isFocusOn}
        onMouseDown={stopOrbitControls}
        onMouseUp={startOrbitControls}
      >
        <BoxMesh id={id} />
      </TransformControls>
    </>
  );
});

const BoxMesh = React.memo(({ id }: any) => {
  const dispatch = useDispatch();
  const onFocus = useCallback(() => {
    dispatch(focusComponent({ id }));
  }, [dispatch, id]);

  const mesh = useRef<Mesh>(null!);

  useHelper(mesh, BoxHelper, Color.NAMES.gray);

  return (
    <mesh onClick={onFocus} ref={mesh}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial transparent={true} opacity={0} />
    </mesh>
  );
});

export default ElementComponent;
