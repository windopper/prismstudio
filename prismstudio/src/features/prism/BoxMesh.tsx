import { useHelper } from "@react-three/drei";
import React, { forwardRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { BoxHelper, Color } from "three";
import { focusComponent, toggleGroupSelectionElements } from "./prismSlice";

interface Prop {
  id: number;
  isGrouped: boolean;
  onFocus?: () => void;
}

const BoxMesh = React.memo(
  forwardRef((props: Prop, ref: any) => {
    const { id, isGrouped } = props;
    const dispatch = useDispatch();

    useHelper(ref, BoxHelper, Color.NAMES.gray);

    const onFocus = useCallback(() => {
      dispatch(focusComponent({ id }));
      dispatch(toggleGroupSelectionElements({ elementId: id }));
    }, [dispatch, id]);

    return (
      <mesh
        onClick={onFocus}
        ref={ref}
        position={[0.5, 0.5, 0.5]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={isGrouped ? "#022b6e" : "#0050d1"} />
      </mesh>
    );
  })
);

export default BoxMesh;
