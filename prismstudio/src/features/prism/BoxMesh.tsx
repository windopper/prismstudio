import { useHelper } from "@react-three/drei";
import React, { forwardRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BoxHelper, Color } from "three";
import { focusComponent, toggleGroupSelectionElements } from "./prismSlice";
import { RootState } from "../../store";

interface Prop {
  elementId: number;
  onFocus?: () => void;
}

const BoxMesh = React.memo(
  forwardRef((props: Prop, ref: any) => {
    const { elementId } = props;
    const { componentId } = useSelector((state: RootState) => {
      const elementState = state.prismSlice.elementStates.find(
        (v) => v.id === elementId
      );

      return {
        componentId: elementState?.currentComponentId
      }
    });

    const isGrouped = useSelector(
      (state: RootState) =>
        state.prismSlice.currentGroupSelectionComponents.findIndex(
          (v) => v.id === componentId
        ) !== -1
    );

    const dispatch = useDispatch();

    useHelper(ref, BoxHelper, Color.NAMES.gray);

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
        <meshStandardMaterial color={isGrouped ? "#e7e7e7" : "#0050d1"} />
      </mesh>
    );
  })
);

export default BoxMesh;
