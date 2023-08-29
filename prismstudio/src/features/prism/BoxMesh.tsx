import { useHelper } from "@react-three/drei";
import React, { forwardRef, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BoxHelper, Color } from "three";
import { focusComponent, outFocusComponent, toggleGroupSelectionElements } from "./prismSlice";
import { RootState } from "../../store";

interface Prop {
  elementId: string,
}

const BoxMesh = React.memo(
  forwardRef((props: Prop, ref: any) => {
    const { elementId } = props;

    const elementState = useSelector((state: RootState) => state.prismSlice.elementStates.byId[elementId]);
    const wrapComponent = useSelector((state: RootState) => state.prismSlice.components.byId[elementState.wrapComponentId]);
    //const enableGroupSelection = useSelector((state: RootState) => state.prismSlice.enableGroupSelection);
    const dispatch = useDispatch();

    //useHelper(isFocused && ref, BoxHelper, "yellow");

    const onFocus = useCallback(() => {
      dispatch(focusComponent({ componentId: wrapComponent.id }));
      // if (wrapComponent.isFocused) {
      //   if (enableGroupSelection) dispatch(outFocusComponent({ componentId: wrapComponent.id }))
      //   else dispatch(focusComponent({ componentId: wrapComponent.id }));
      // }
      // else {
      //   dispatch(focusComponent({ componentId: wrapComponent.id }));
      // }
    }, [dispatch, wrapComponent]);

    return (
      <mesh onClick={onFocus} ref={ref} position={[0.5, 0.5, 0.5]}>
        {/* <boxHelper /> */}
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={wrapComponent.isFocused ? "#e7e7e7" : "#0050d1"} opacity={wrapComponent.isFocused ? 0.5 : 1} transparent={true} />
      </mesh>
    );
  })
);

export default BoxMesh;
