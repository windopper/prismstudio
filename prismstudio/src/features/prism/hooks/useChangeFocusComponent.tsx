import { useCallback, useEffect, useMemo, useRef } from "react";
import { Group, Vector3, BoxHelper, Quaternion, Mesh, Euler } from "three";
import { SingleComponent, updateElementStates } from "../prismSlice";
import { useThree } from "@react-three/fiber";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { getElementIdsFromComponents } from "../utils/prismSliceUtil";

const useChangeFocusComponent = (
  focusOn: string[],
  elementRefs: React.MutableRefObject<Map<string, Mesh>>
) => {
  const dispatch = useDispatch();
  const controlRef = useRef<any>(null);
  const { scene } = useThree();
  const { components } = useSelector((state: RootState) => state.prismSlice);
  const focusedComponents = focusOn.map(v => components.byId[v]);

  const elementIds = useMemo(() => getElementIdsFromComponents(focusedComponents, components), [focusedComponents, components]);
  const elements = useMemo(() => new Map(elementRefs.current), [focusOn]);

  const onDraggingChanged = useCallback((event: THREE.Event) => {
    if (event.target?.dragging) return;
    const updatingElementStates: any[] = [];
    for (let elementId of elementIds) {
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
  }, [elements, elementIds, dispatch]);

  const onChange = useCallback((event: THREE.Event) => {}, []);

  useEffect(() => {
    if (focusOn.length === 0) return;

    const isSelectSingle = focusOn.length === 1;
    const control = controlRef.current; 

    /* 새로운 그룹을 생성 및 scene에 추가 */
    const elementGroup = new Group();
    const elementBoxes: BoxHelper[] = [];
    const wrapperGroup = new Group();
    scene.add(elementGroup);
    scene.add(wrapperGroup);

    const controlPosition: [x: number, y: number, z: number] = [999, 999, 999];

    /* 선택된 요소에 대하여 controlPosition 계산 및 그룹에 요소 추가 */
    for (let elementId of elementIds) {
      const element = elements.get(elementId);
      if (element === undefined) continue;
      elementGroup.add(element);
      const elementPosition = element.getWorldPosition(new Vector3());
      if (controlPosition[0] > elementPosition.x - 0.5)
        controlPosition[0] = elementPosition.x - 0.5;
      if (controlPosition[1] > elementPosition.y - 0.5)
        controlPosition[1] = elementPosition.y - 0.5;
      if (controlPosition[2] > elementPosition.z - 0.5)
        controlPosition[2] = elementPosition.z - 0.5;
      
      const box = new BoxHelper(element, '#e0de67');
      elementBoxes.push(box);
    }

    /* 그룹 박스 테두리 헬퍼 추가 */
    const groupBox = new BoxHelper(elementGroup, '#28cc4c');
    if (!isSelectSingle) {
      scene.add(groupBox);
      wrapperGroup.add(groupBox);
    } 
    else {
      for (const box of elementBoxes) {
        scene.add(box);
        wrapperGroup.add(box);
      }
    }

    /* 래퍼 그룹에 추가 */
    wrapperGroup.add(elementGroup);    

    /* 컨트롤러에 래퍼 그룹 부착 및 위치 설정 */
    if (isSelectSingle) {
      control?.attach(wrapperGroup);
      control?.position.set(...controlPosition);
      control?.addEventListener("change", onChange);
      control?.addEventListener("dragging-changed", onDraggingChanged);
    }

    return () => {
      if (isSelectSingle) {
        control?.removeEventListener("dragging-changed", onDraggingChanged);
        control?.removeEventListener("change", onChange);
      }

      for (let elementId of elementIds) {
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
      if (focusOn === undefined) control?.dispose();
      scene.remove(elementGroup);
      scene.remove(wrapperGroup);
      scene.remove(...elementBoxes, groupBox);
    };
  }, [focusOn, focusedComponents]);

  return { controlRef };
};

export default useChangeFocusComponent;
