import { useEffect, useRef } from "react";
import { Group, Vector3, BoxHelper, Quaternion, Mesh, Euler } from "three";
import { SingleComponent, updateElementStates } from "../prismSlice";
import { useThree } from "@react-three/fiber";
import { useDispatch } from "react-redux";

const useChangeFocusComponent = (
  focusOn: number | undefined,
  focusedComponent: SingleComponent | undefined,
  elementRefs: React.MutableRefObject<Map<number, Mesh>>
) => {
  const controlRef = useRef<any>(null);
  const { scene } = useThree();
  const dispatch = useDispatch();

  useEffect(() => {
    if (focusOn === undefined) return;
    if (focusedComponent?.elementIds === undefined) return;

    const control = controlRef.current;
    const elements = new Map(elementRefs.current);

    /* 새로운 그룹을 생성 및 scene에 추가 */
    const elementGroup = new Group();
    const wrapperGroup = new Group();
    scene.add(elementGroup);
    scene.add(wrapperGroup);

    const controlPosition: [x: number, y: number, z: number] = [999, 999, 999];

    /* 선택된 요소에 대하여 controlPosition 계산 및 그룹에 요소 추가 */
    for (let elementId of focusedComponent?.elementIds) {
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
    }

    /* 래퍼 그룹에 추가 및 transformControls 위치 설정 */
    const box = new BoxHelper(elementGroup, '#28cc4c');
    scene.add(box);
    wrapperGroup.add(elementGroup);
    wrapperGroup.add(box);
    control.attach(wrapperGroup);
    control.position.set(...controlPosition);

    const onDraggingChanged = (event: THREE.Event) => {
      if (event.target?.dragging) return;
      const updatingElementStates: any[] = [];
      for (let elementId of focusedComponent?.elementIds) {
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
    };

    const onChange = (event: THREE.Event) => {};

    control?.addEventListener("change", onChange);
    control?.addEventListener("dragging-changed", onDraggingChanged);

    return () => {
      control?.removeEventListener("dragging-changed", onDraggingChanged);
      control?.removeEventListener("change", onChange);

      for (let elementId of focusedComponent?.elementIds) {
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
      scene.remove(box);
    };
  }, [focusOn, focusedComponent]);

  return { controlRef };
};

export default useChangeFocusComponent;
