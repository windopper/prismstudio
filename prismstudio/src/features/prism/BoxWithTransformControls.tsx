import React, { useCallback, useRef } from "react";
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

const BoxWithTransformControls = React.memo(
  (props: BoxWithTransformControlsProps) => {
    const { enableTransformControl, isGrouped, id, transformControlsMode } =
      props;
    const dispatch = useDispatch();

    const boxRef = useRef<Mesh>(null!);

    const updatePosition = (e: Event | undefined) => {
      const parent = boxRef.current.parent;
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
      <PrismTransformControls
        enableTransformControl={enableTransformControl}
        onUpdate={updatePosition}
        transformControlsMode={transformControlsMode}
      >
        <BoxMesh isGrouped={isGrouped} id={id} ref={boxRef} onFocus={onFocus} />
      </PrismTransformControls>
    );
  }
);

export default BoxWithTransformControls;
