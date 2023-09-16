import { useCallback, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  setTransformControlsState,
  toggleOrbitControl,
  updateElementStates,
} from "../redux/prismSlice";
import useFocusedChildrenElementIds from "./useFocusedChildrenElementIds";
import { Euler, Mesh, Quaternion, Vector3 } from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { boxMeshs } from "prism/components/canvas/BoxMesh";

const useTransformControlEvent = (
  transformControls?: TransformControls
) => {
  const elementRefs = boxMeshs;
  const dispatch = useDispatch();
  const childrenElementIds = useFocusedChildrenElementIds();
  const elements = new Map(elementRefs);

  const stopOrbitControls = useCallback(() => {
    dispatch(toggleOrbitControl(false));
  }, [dispatch]);

  const startOrbitControls = useCallback(() => {
    dispatch(toggleOrbitControl(true));
  }, [dispatch]);

  const onDraggingChangedUpdateElementStates = useCallback(
    (event: THREE.Event) => {
      if (event.target?.dragging) return;
      const updatingElementStates: any[] = [];

      for (let elementId of ([] as string[]).concat(...childrenElementIds)) {
        let __worldElement = elements.get(elementId)?.current;
        if (__worldElement === undefined) continue;

        let __elementPosition = __worldElement?.getWorldPosition(new Vector3());
        let __elementEuler = new Euler().setFromQuaternion(
          __worldElement?.getWorldQuaternion(new Quaternion())
        );
        let __elementScale = __worldElement?.getWorldScale(new Vector3());

        updatingElementStates.push({
          elementId,
          position: [
            __elementPosition.x,
            __elementPosition.y,
            __elementPosition.z,
          ],
          rotate: [__elementEuler.x, __elementEuler.y, __elementEuler.z],
          scale: [__elementScale.x, __elementScale.y, __elementScale.z],
        });
      }
      dispatch(updateElementStates(updatingElementStates));
    },
    [elements, childrenElementIds, dispatch]
  );

  const onDraggingChangedUpdateTransformControlsState = useCallback(
    (event: THREE.Event) => {
      if (
        transformControls === undefined ||
        transformControls.object === undefined
      )
        return;
      if (event.target.dragging) return;
      const __position = transformControls.object.getWorldPosition(
        new Vector3()
      );
      const __euler = new Euler().setFromQuaternion(
        transformControls.object.getWorldQuaternion(new Quaternion())
      );
      const __scale = transformControls.object.getWorldScale(new Vector3());
      dispatch(
        setTransformControlsState({
          transformControlsState: {
            position: [__position.x, __position.y, __position.z],
            rotate: [__euler.x, __euler.y, __euler.z],
            scale: [__scale.x, __scale.y, __scale.z],
          },
        })
      );
    },
    [dispatch, transformControls]
  );

  const onDraggingChanged = useCallback(
    (event: THREE.Event) => {
      onDraggingChangedUpdateTransformControlsState(event);
      onDraggingChangedUpdateElementStates(event);
    },
    [
      onDraggingChangedUpdateElementStates,
      onDraggingChangedUpdateTransformControlsState,
    ]
  );

  const onChange = useCallback((event: THREE.Event) => {}, []);

  useEffect(() => {
    if (transformControls === undefined) return;
    transformControls.addEventListener("mouseDown", stopOrbitControls);
    transformControls.addEventListener("mouseUp", startOrbitControls);
    transformControls.addEventListener("dragging-changed", onDraggingChanged);
    return () => {
      transformControls.removeEventListener("mouseDown", stopOrbitControls);
      transformControls.removeEventListener("mouseUp", startOrbitControls);
      transformControls.removeEventListener(
        "dragging-changed",
        onDraggingChanged
      );
    };
  }, [transformControls]);
};

export default useTransformControlEvent;
