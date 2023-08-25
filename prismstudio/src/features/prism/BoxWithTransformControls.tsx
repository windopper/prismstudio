import React, { forwardRef, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { Event, Mesh, Vector3 } from "three";
import {
  focusComponent,
  toggleGroupSelectionElements,
  updateFocusedComponentPosition,
} from "./prismSlice";
import BoxMesh from "./BoxMesh";
import PrismTransformControls, {
  PrismTransformControlsProps,
} from "./PrismTransformControls";

interface BoxWithTransformControlsProps extends PrismTransformControlsProps {
  id: number;
  isGrouped: boolean;
}

const BoxWithTransformControls = React.memo(forwardRef(
  (props: BoxWithTransformControlsProps, ref: any) => {
    const { isGrouped, id, transformControlsMode } =
      props;
    const dispatch = useDispatch();

    const updatePosition = (e: Event | undefined) => {
      const parent = ref?.current?.parent;
      const vector3: Vector3 = parent?.position!;
      const position: [x: number, y: number, z: number] = [
        vector3.x,
        vector3.y,
        vector3.z,
      ];
      dispatch(updateFocusedComponentPosition({ position }));
    };

    const onFocus = useCallback(() => {
      dispatch(focusComponent({ id }));
      dispatch(toggleGroupSelectionElements({ elementId: id }));
    }, [dispatch, id]);

    return (
      // <PrismTransformControls
      //   enableTransformControl={enableTransformControl}
      //   onUpdate={updatePosition}
      //   transformControlsMode={transformControlsMode}
      // >
      // </PrismTransformControls>
      <BoxMesh isGrouped={isGrouped} id={id} ref={ref} onFocus={onFocus} />
    );
  }
));

export default BoxWithTransformControls;
