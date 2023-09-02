import { useCallback, useEffect, useMemo, useRef } from "react";
import { Group, Vector3, BoxHelper, Quaternion, Mesh, Euler, Box3, MeshBasicMaterial } from "three";
import { SingleComponent, updateElementStates } from "../redux/prismSlice";
import { useThree } from "@react-three/fiber";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { getChildElementIdsFromComponents } from "../utils/componentUtil";
import { OBB } from 'three/examples/jsm/math/OBB';

const useChangeFocusComponent = (
  elementRefs: React.MutableRefObject<Map<string, Mesh>>
) => {
  const dispatch = useDispatch();
  const controlRef = useRef<any>(null);
  const { scene } = useThree();
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
      let worldElement = elements.get(elementId);
      if (worldElement === undefined) continue;

      let elementPosition = worldElement?.getWorldPosition(new Vector3());
      let elementEuler = new Euler().setFromQuaternion(
        worldElement?.getWorldQuaternion(new Quaternion())
      );
      let elementScale = worldElement?.getWorldScale(new Vector3());

      updatingElementStates.push({
        elementId,
        position: [elementPosition.x, elementPosition.y, elementPosition.z],
        rotate: [elementEuler.x, elementEuler.y, elementEuler.z],
        scale: [elementScale.x, elementScale.y, elementScale.z],
      });
    }
    dispatch(updateElementStates(updatingElementStates));
  }, [elements, elementIdsAsAllFocusedComponents, dispatch]);

  const onChange = useCallback((event: THREE.Event) => {
    
  }, []);

  useEffect(() => {
    if (focusOn.length === 0) return;

    const isSelectSingle = focusOn.length === 1;
    const control = controlRef.current; 

    /* 새로운 그룹을 생성 및 scene에 추가 */
    const elementGroups: Group[] = [];
    const boxHelpers: BoxHelper[] = [];
    const wrapperGroup = new Group();
    scene.add(wrapperGroup);
    
    const controlPosition: [x: number, y: number, z: number] = [999, 999, 999];
    
    /* 루트 컴포넌트 마다 받아온 아이디로 그룹을 지정함 */
    for (let elementIds of elementIdsAsAllFocusedComponents) {
      const elementIdsSize = elementIds.length;
      if (elementIdsSize === 0) continue;

      const elementGroup = new Group();
      elementGroups.push(elementGroup);
      scene.add(elementGroup);

      if (elementIdsSize === 1) {
        const element = elements.get(elementIds[0]);

        console.log(element);
        if (element !== undefined) {
          //elementGroup.add(element);
          const hitbox = new Mesh(element.geometry, new MeshBasicMaterial({color: 0x000000, wireframe: true}))
          element.add(hitbox);
          //const elementBox = new BoxHelper(element, '#28cc4c');
          const size = new Vector3(1, 1, 1);
          //boxHelpers.push(elementBox);
          //scene.add(elementBox);

          wrapperGroup.add(element);
          //wrapperGroup.add(elementBox);

          controlPosition[0] = element.position.x
          controlPosition[1] = element.position.y;
          controlPosition[2] = element.position.z;
          // element.geometry.computeBoundingBox();
          // if (element.geometry?.boundingBox) {
          //   controlPosition[0] = element.geometry.boundingBox.min.x + element.position.x;
          //   controlPosition[1] = element.geometry.boundingBox.min.y + element.position.y;
          //   controlPosition[2] = element.geometry.boundingBox.min.z + element.position.z;
          // }
        }
      }
      else if (elementIdsSize >= 2) {
        /* 선택된 요소에 대하여 controlPosition 계산 및 그룹에 요소 추가 */
        for (let elementId of elementIds) {
          const element = elements.get(elementId);
          if (element === undefined) continue;
          elementGroup.add(element);
        }
  
        /* 그룹 박스 테두리 헬퍼 추가 */
        const groupBox = new BoxHelper(elementGroup, '#28cc4c');
        boxHelpers.push(groupBox);
        scene.add(groupBox);
  
        /* 래퍼 그룹에 추가 */
        wrapperGroup.add(elementGroup);
        wrapperGroup.add(groupBox);
  
        /* bounding box 모서리 컨트롤 위치 갱신 */
        groupBox.geometry.computeBoundingBox()
        if (groupBox.geometry.boundingBox) {
          controlPosition[0] = groupBox.geometry.boundingBox.min.x;
          controlPosition[1] = groupBox.geometry.boundingBox.min.y;
          controlPosition[2] = groupBox.geometry.boundingBox.min.z;
        }
      }

    }

    /* 컨트롤러에 래퍼 그룹 부착 및 위치 설정 */
    if (isSelectSingle) {
      control?.attach(wrapperGroup);
      const vec = new Vector3();
      console.log(control?.getWorldPosition(vec));
      //control?.worldPosition.set(...controlPosition);
      //control?.position.set(...controlPosition);
      console.log(control?.worldPosition)
      control?.addEventListener("change", onChange);
      control?.addEventListener("dragging-changed", onDraggingChanged);
    }

    return () => {
      if (isSelectSingle) {
        control?.removeEventListener("dragging-changed", onDraggingChanged);
        control?.removeEventListener("change", onChange);
      }

      for (let elementId of ([] as string[]).concat(...elementIdsAsAllFocusedComponents)) {
        let worldElement = elements.get(elementId);
        if (worldElement === undefined) continue;
        let elementPosition = worldElement?.getWorldPosition(new Vector3());
        let elementQuaternion = worldElement?.getWorldQuaternion(
          new Quaternion()
        );
        let elementScale = worldElement?.getWorldScale(new Vector3());
        worldElement?.removeFromParent();
        scene.add(worldElement);

        worldElement?.position.copy(elementPosition!);
        worldElement?.quaternion.copy(elementQuaternion!);
        worldElement?.scale.copy(elementScale!);
      }

      if (focusOn.length === 0) control?.detach();
      scene.remove(...elementGroups);
      scene.remove(...boxHelpers);
      scene.remove(wrapperGroup);
    };
  }, [focusOn, focusedComponents]);

  return { controlRef };
};

export default useChangeFocusComponent;
