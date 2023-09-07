import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Mesh } from "three";
import { RootState } from "store";
import useTransformControls from "prism/hooks/useTransformControls";
import useTransformControlEvent from "prism/hooks/useTransformControlEvent";

export interface PrismTransformControlsProps {
  elementRefs: React.MutableRefObject<Map<string, Mesh>>;
}

const PrismTransformControls = React.memo(
  (props: PrismTransformControlsProps) => {
    const { elementRefs } = props;
    const { transformControlsMode } = useSelector(
      (state: RootState) => state.prismSlice
    );

    const transformControls = useTransformControls(elementRefs);
    const {
      stopOrbitControls,
      startOrbitControls,
      onChange,
      onDraggingChanged,
    } = useTransformControlEvent(elementRefs);

    useEffect(() => {
      if (transformControls === undefined) return;
      transformControls.addEventListener('mouseDown', stopOrbitControls);
      transformControls.addEventListener('mouseUp', startOrbitControls);
      transformControls?.addEventListener('dragging-changed', onDraggingChanged);
      return () => {
        transformControls.removeEventListener('mouseDown', stopOrbitControls);
        transformControls.removeEventListener('mouseUp', startOrbitControls);
        transformControls?.removeEventListener('dragging-changed', onDraggingChanged);
      }
    }, [transformControls]);

    useEffect(() => {
      if (transformControls === undefined) return;
      transformControls.setMode(transformControlsMode);
    }, [transformControls, transformControlsMode])

    return null;
  }
);

export default PrismTransformControls;
