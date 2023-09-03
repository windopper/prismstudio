import { useEffect, useMemo, useState } from "react";
import { Group, Vector3, BoxHelper, Quaternion, Mesh, Box3 } from "three";
import { useThree } from "@react-three/fiber";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import useFocusedChildrenElementIds from "./useChildrenElementIds";

const useGroupFocusedElements = (
  elementRefs: React.MutableRefObject<Map<string, Mesh>>
) => {
  const [wrapperGroup, setWrapperGroup] = useState<Group | undefined>();
  const { scene } = useThree();
  const { focusOn } = useSelector((state: RootState) => state.prismSlice);
  const childrenElementIds = useFocusedChildrenElementIds();
  const elements = useMemo(() => new Map(elementRefs.current), [focusOn]);

  useEffect(() => {
    if (focusOn.length === 0) {
      setWrapperGroup(undefined)
    }

    const elementGroups: Group[] = [];
    const boxHelpers: BoxHelper[] = [];
    const elementWrapperGroup = new Group();
    const boxHelperWrapperGroup = new Group();
    const newWrapperGroup = new Group();
    newWrapperGroup.userData = {
      elementSize: 0
    };
    scene.add(newWrapperGroup);
    scene.add(elementWrapperGroup);
    scene.add(boxHelperWrapperGroup);
    boxHelperWrapperGroup.position.set(0, 0, 0);
    newWrapperGroup.add(elementWrapperGroup, boxHelperWrapperGroup);
    
    /* 루트 컴포넌트 마다 받아온 아이디로 그룹을 지정함 */
    for (let elementIds of childrenElementIds) {
      const elementIdsSize = elementIds.length;
      if (elementIdsSize === 0) continue;
      newWrapperGroup.userData.elementSize++;

      const __elementGroup = new Group();
      scene.add(__elementGroup);
      elementGroups.push(__elementGroup);
      elementWrapperGroup.add(__elementGroup);
      
      let __groupBox: BoxHelper | undefined = undefined;

      for (let elementId of elementIds) {
        const __element = elements.get(elementId);
        if (__element === undefined) continue;
        __elementGroup.add(__element);
      }
      
      if (elementIdsSize >= 2) {
        /* 그룹 박스 테두리 헬퍼 추가 */
        __groupBox = new BoxHelper(__elementGroup, "#28cc4c");
        scene.add(__groupBox);
        boxHelperWrapperGroup.add(__groupBox);
        boxHelpers.push(__groupBox);
      }
      
      const box3 = new Box3().setFromObject(__elementGroup);
      const center = new Vector3();
      box3.getCenter(center);

      /* 상대 좌표 갱신 */
      for (let elementId of elementIds) {
        const __element = elements.get(elementId);
        const __position = new Vector3();
        __element?.getWorldPosition(__position);
        __position.sub(center)
        __element?.position.copy(__position);
      }

      __elementGroup.position.copy(center);
    }

    const box3 = new Box3().setFromObject(elementWrapperGroup);
    const center = new Vector3();
    box3.getCenter(center);

    for (const elementGroup of elementGroups) {
      const __position = new Vector3();
      elementGroup.getWorldPosition(__position);
      /* 상대 좌표 */
      __position.sub(center);
      elementGroup.position.copy(__position);
    }

    elementWrapperGroup.position.set(0, 0, 0);
    newWrapperGroup.position.copy(center);
    boxHelperWrapperGroup.position.copy(center.multiplyScalar(-1))
    setWrapperGroup(newWrapperGroup);

    return () => {
      for (let elementId of ([] as string[]).concat(...childrenElementIds)) {
        let __worldElement = elements.get(elementId);
        if (__worldElement === undefined) continue;
        const __elementPosition = new Vector3();
        const __elementQuaternion = new Quaternion();
        const __elementScale = new Vector3();
        __worldElement.getWorldPosition(__elementPosition);
        __worldElement.getWorldQuaternion(__elementQuaternion);
        __worldElement.getWorldScale(__elementScale);
        __worldElement.removeFromParent();
        scene.remove(__worldElement);
        console.log(__elementPosition);
        scene.add(__worldElement);
        __worldElement.position.copy(__elementPosition);
        __worldElement.quaternion.copy(__elementQuaternion);
        __worldElement.scale.copy(__elementScale);
        console.log(__worldElement)
      }

      scene.remove(...elementGroups);
      scene.remove(...boxHelpers);
      scene.remove(elementWrapperGroup);
      scene.remove(boxHelperWrapperGroup);
      scene.remove(newWrapperGroup)
    };
  }, [focusOn]);

  return { wrapperGroup };
};

export default useGroupFocusedElements;
