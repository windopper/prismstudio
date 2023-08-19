import { TransformControls, useHelper } from "@react-three/drei";
import React, { forwardRef, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { BoxHelper, Color, Mesh } from "three";
import { focusComponent } from "../features/prism/prismSlice";

interface Prop {
  id: number;
  isFocusOn: boolean;
}

const ElementComponent = React.memo((props: Prop) => {
  const { id, isFocusOn } = props;
  const dispatch = useDispatch();
  const mesh = useRef<Mesh>(null!);

  const onFocus = () => {
    dispatch(focusComponent({ id }));
  };

  useHelper(mesh, BoxHelper, Color.NAMES.gray);

  return (
    <>
      {isFocusOn ? (
        <TransformControls >
          <mesh ref={mesh}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial transparent={true} opacity={0} />
          </mesh>
        </TransformControls>
      ) : (
        <mesh onClick={onFocus} ref={mesh}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial transparent={true} opacity={0} />
        </mesh>
      )}
    </>
  );
});

export default ElementComponent;
