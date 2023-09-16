import {
  ThreeArray,
  setTransformControlsState,
  updateElementStates,
} from "prism/redux/prismSlice";
import useFocusedChildrenElementIds from "./useFocusedChildrenElementIds";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { Euler, Mesh, Quaternion, Vector3 } from "three";
import { boxMeshs } from "prism/components/canvas/BoxMesh";

interface Props {
  groupPosition: ThreeArray;
  groupRotation: ThreeArray;
  groupScale: ThreeArray;
}

/**
 * 현재 조작 중인 박스들의 상태를 리덕스 상태에 업데이트
 *
 * @param groupPosition
 * @param groupRotation
 * @param groupScale
 */
const useDispatchStateOnControlled = () => {
  const elements = new Map(boxMeshs);
  const dispatch = useDispatch();
  const focusedChildrenElementIds = useFocusedChildrenElementIds();

  const dispatchElementStates = useCallback(() => {
    const updatingElementStates: any[] = [];

    for (let __id of ([] as string[]).concat(...focusedChildrenElementIds)) {
      const __worldElement = elements.get(__id)?.current;
      if (__worldElement === undefined) continue;

      let __elementPosition = __worldElement?.getWorldPosition(new Vector3());
      let __elementEuler = new Euler().setFromQuaternion(
        __worldElement?.getWorldQuaternion(new Quaternion())
      );
      let __elementScale = __worldElement?.getWorldScale(new Vector3());

      updatingElementStates.push({
        elementId: __id,
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
  }, [elements, focusedChildrenElementIds, dispatch]);

  const dispatchTransformControlsState = useCallback(
    (position: ThreeArray, rotate: ThreeArray, scale: ThreeArray) => {
      dispatch(
        setTransformControlsState({
          transformControlsState: {
            position,
            rotate,
            scale,
          },
        })
      );
    },
    [dispatch]
  );

  return {
    dispatchElementStates,
    dispatchTransformControlsState,
  };
};

export default useDispatchStateOnControlled;
