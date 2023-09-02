import { useCallback, useEffect, useMemo, useState } from "react";
import { Group, Vector3, BoxHelper, Quaternion, Mesh, Euler, MeshBasicMaterial, Box3 } from "three";
import { updateElementStates } from "../redux/prismSlice";
import { useThree } from "@react-three/fiber";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { getChildElementIdsFromComponents } from "../utils/componentUtil";

const useChangeFocusComponent = (
  elementRefs: React.MutableRefObject<Map<string, Mesh>>
) => {
  const dispatch = useDispatch();
  //const controlRef = useRef<any>(null);
  const { scene } = useThree();

  const [wrapperGroup, setWrapperGroup] = useState<Group | undefined>();

  const { components: componentsMap, focusOn } = useSelector((state: RootState) => state.prismSlice);
  const focusedComponents = focusOn.map(v => componentsMap.byId[v]);

  /* 각 루트 컴포넌트 마다 그룹을 설정하기 위해서 2차원 배열의 요소 아이디를 받아옴 */
  const elementIdsAsAllFocusedComponents: string[][] = useMemo(
    () =>
      focusedComponents.map((v) =>
        getChildElementIdsFromComponents([v], componentsMap)
      ),
    [focusedComponents, componentsMap]
  );
  const elements = useMemo(() => new Map(elementRefs.current), [focusOn]);

  /* transformControls 이벤트 함수 */
  const onDraggingChanged = useCallback((event: THREE.Event) => {
    if (event.target?.dragging) return;
    const updatingElementStates: any[] = [];

    for (let elementId of ([] as string[]).concat(...elementIdsAsAllFocusedComponents) ) {
      let __worldElement = elements.get(elementId);
      if (__worldElement === undefined) continue;

      let __elementPosition = __worldElement?.getWorldPosition(new Vector3());
      let __elementEuler = new Euler().setFromQuaternion(
        __worldElement?.getWorldQuaternion(new Quaternion())
      );
      let __elementScale = __worldElement?.getWorldScale(new Vector3());

      updatingElementStates.push({
        elementId,
        position: [__elementPosition.x, __elementPosition.y, __elementPosition.z],
        rotate: [__elementEuler.x, __elementEuler.y, __elementEuler.z],
        scale: [__elementScale.x, __elementScale.y, __elementScale.z],
      });
    }
    dispatch(updateElementStates(updatingElementStates));
  }, [elements, elementIdsAsAllFocusedComponents, dispatch]);

  const onChange = useCallback((event: THREE.Event) => {
    
  }, []);

  useEffect(() => {
    if (focusOn.length === 0) {
      setWrapperGroup(undefined)
    }

    /* 새로운 그룹을 생성 및 scene에 추가 */
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
    for (let elementIds of elementIdsAsAllFocusedComponents) {
      const elementIdsSize = elementIds.length;
      if (elementIdsSize === 0) continue;
      newWrapperGroup.userData.elementSize++;

      const __elementGroup = new Group();
      scene.add(__elementGroup);
      elementGroups.push(__elementGroup);
      elementWrapperGroup.add(__elementGroup);
      
      let __groupBox: BoxHelper | undefined = undefined;

      if (elementIdsSize === 1) {
        const __element = elements.get(elementIds[0]);
        if (__element === undefined) continue;
        __elementGroup.add(__element);
      }
      else if (elementIdsSize >= 2) {
        /* 선택된 요소에 대하여 controlPosition 계산 및 그룹에 요소 추가 */
        for (let elementId of elementIds) {
          const __element = elements.get(elementId);
          if (__element === undefined) continue;
          __elementGroup.add(__element);
        }

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
      console.log(__position);
      __position.sub(center);
      elementGroup.position.copy(__position);
    }

    elementWrapperGroup.position.set(0, 0, 0);
    newWrapperGroup.position.copy(center);
    boxHelperWrapperGroup.position.copy(center.multiplyScalar(-1))
    setWrapperGroup(newWrapperGroup);

    return () => {
      for (let elementId of ([] as string[]).concat(...elementIdsAsAllFocusedComponents)) {
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

export default useChangeFocusComponent;
