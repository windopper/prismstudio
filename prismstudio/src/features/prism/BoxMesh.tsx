import { useHelper } from "@react-three/drei";
import React, { forwardRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BoxHelper, Color } from "three";
import { focusComponent, toggleGroupSelectionElements } from "./prismSlice";
import { RootState } from "../../store";

interface Prop {
  elementId: number;
  componentId: number,
  onFocus?: () => void;
}

const BoxMesh = React.memo(
  forwardRef((props: Prop, ref: any) => {
    const { elementId, componentId } = props;

    const isGrouped = useSelector(
      (state: RootState) =>
        state.prismSlice.currentGroupSelectionComponents.findIndex(
          (v) => v.id === componentId
        ) !== -1
    );

    const isFocus = useSelector(
      (state: RootState) => state.prismSlice.focusOn === componentId
    )

    const dispatch = useDispatch();

    useHelper(ref, BoxHelper, Color.NAMES.aquamarine);

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
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={isGrouped ? "#e7e7e7" : "#0050d1"} opacity={isFocus ? 0.5 : 1} transparent={true} />
      </mesh>
    );
  })
);

export default BoxMesh;
