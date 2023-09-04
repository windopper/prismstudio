import React, { forwardRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { focusComponent } from "../redux/prismSlice";
import { RootState } from "../../store";

interface Prop {
  elementId: string,
}

const BoxMesh = React.memo(
  forwardRef((props: Prop, ref: any) => {
    const { elementId } = props;

    const elementState = useSelector((state: RootState) => state.prismSlice.elementStates.byId[elementId]);
    const wrapComponent = useSelector((state: RootState) => state.prismSlice.components.byId[elementState.wrapComponentId]);
    const groupComponent = useSelector((state: RootState) => state.prismSlice.components.byId[wrapComponent.topPointer]);
    const dispatch = useDispatch();

    const onFocus = useCallback(() => {
      dispatch(focusComponent({ componentId: wrapComponent.id }))
    }, [dispatch, wrapComponent.id]);

    return (
      <mesh onClick={onFocus} ref={ref}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={"#0050d1"}
          opacity={wrapComponent.isFocused ? 0.7 : 1}
          transparent={true}
          wireframe={wrapComponent.isFocused}
        />
      </mesh>
    );
  })
);

export default BoxMesh;
