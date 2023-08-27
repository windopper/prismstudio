import { useHelper } from "@react-three/drei";
import React, { forwardRef, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BoxHelper, Color } from "three";
import { focusComponent, toggleGroupSelectionElements } from "./prismSlice";
import { RootState } from "../../store";

interface Prop {
  elementId: number;
  componentId: number,
  isFocused: boolean,
  onFocus?: () => void;
}

const BoxMesh = React.memo(
  forwardRef((props: Prop, ref: any) => {
    const { elementId, componentId, isFocused } = props;

    const isGrouped = useSelector(
      (state: RootState) =>
        state.prismSlice.currentGroupSelectionComponents.findIndex(
          (v) => v.id === componentId
        ) !== -1
    );

    const dispatch = useDispatch();

    useHelper(isFocused && ref, BoxHelper, "yellow");

    const onFocus = useCallback(() => {
      componentId && dispatch(focusComponent({ id: componentId }));
      componentId && dispatch(
          toggleGroupSelectionElements({
            componentId: componentId,
          })
        );
    }, [dispatch, componentId]);

    return (
      <mesh onClick={onFocus} ref={ref} position={[0.5, 0.5, 0.5]}>
        {/* <boxHelper /> */}
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={isGrouped ? "#e7e7e7" : "#0050d1"} opacity={isFocused ? 0.5 : 1} transparent={true} />
      </mesh>
    );
  })
);

export default BoxMesh;
