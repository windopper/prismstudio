import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Mesh } from "three";
import { RootState } from "store";
import useTransformControls from "prism/hooks/useTransformControls";
import useTransformControlEvent from "prism/hooks/useTransformControlEvent";


const PrismTransformControls = React.memo(
  () => {
    const { transformControlsMode } = useSelector(
      (state: RootState) => state.prismSlice
    );

    const transformControls = useTransformControls();
    useTransformControlEvent(transformControls);

    useEffect(() => {
      if (transformControls === undefined) return;
      transformControls.setMode(transformControlsMode);
    }, [transformControls, transformControlsMode])

    return null;
  }
);

export default PrismTransformControls;
