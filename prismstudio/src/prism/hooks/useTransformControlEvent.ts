import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { toggleOrbitControl, updateElementStates } from "../redux/prismSlice";
import useFocusedChildrenElementIds from "./useChildrenElementIds";
import { Euler, Mesh, Quaternion, Vector3 } from "three";

const useTransformControlEvent = (
  elementRefs: React.MutableRefObject<Map<string, Mesh>>
) => {
  const dispatch = useDispatch();
  const childrenElementIds = useFocusedChildrenElementIds();
  const elements = new Map(elementRefs.current);

  const stopOrbitControls = useCallback(() => {
    dispatch(toggleOrbitControl(false));
  }, [dispatch]);

  const startOrbitControls = useCallback(() => {
    dispatch(toggleOrbitControl(true));
  }, [dispatch]);

  const onDraggingChanged = useCallback(
    (event: THREE.Event) => {
      if (event.target?.dragging) return;
      const updatingElementStates: any[] = [];

      for (let elementId of ([] as string[]).concat(...childrenElementIds)) {
        let __worldElement = elements.get(elementId);
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

  const onChange = useCallback((event: THREE.Event) => {}, []);

  return {
    stopOrbitControls,
    startOrbitControls,
    onDraggingChanged,
    onChange
  };
};

export default useTransformControlEvent;
