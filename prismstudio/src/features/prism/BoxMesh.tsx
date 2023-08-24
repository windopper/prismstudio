import { useHelper } from "@react-three/drei";
import React, { forwardRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { BoxHelper, Color } from "three";
import { focusComponent, toggleGroupSelectionElements } from "./prismSlice";

interface Prop {
  id: number;
  isGrouped: boolean;
  position?: [x: number, y: number, z: number];
  onFocus?: () => void;
}

const BoxMesh = React.memo(
  forwardRef((props: Prop, ref: any) => {
    const { id, isGrouped, onFocus, position } = props;
    const dispatch = useDispatch();

    useHelper(ref, BoxHelper, Color.NAMES.gray);
    console.log(position);
    return (
      <mesh
        onClick={onFocus}
        ref={ref}
        position={position === undefined ? [0.5, 0.5, 0.5] : position!}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={isGrouped ? "#022b6e" : "#0050d1"} />
      </mesh>
    );
  })
);

export default BoxMesh;
