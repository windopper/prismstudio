import { useEffect, useMemo, useState } from "react";
import { Group, Vector3, BoxHelper, Quaternion, Mesh, Box3 } from "three";
import { useThree } from "@react-three/fiber";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import useFocusedChildrenElementIds from "./useFocusedChildrenElementIds";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { boxMeshs } from "prism/components/canvas/BoxMesh";

const useTransformControls = (): TransformControls | undefined => {
  const [transformControls, setTransformControls] = useState<
    TransformControls | undefined
  >();
  const { focusOn, elementStates, transformControlsState } = useSelector(
    (state: RootState) => state.prismSlice
  );
  const { scene, camera, gl } = useThree();
  const childrenElementIds = useFocusedChildrenElementIds();
  const elements = useMemo(() => new Map(boxMeshs), [focusOn]);

  useEffect(() => {
    if (
      transformControls === undefined ||
      transformControls.object === undefined ||
      transformControlsState === undefined
    )
      return;
    const group: Group = transformControls.object as Group;
    scene.attach(group);
    group.position.set(...transformControlsState.position);
    group.rotation.set(...transformControlsState.rotate);
    group.scale.set(...transformControlsState.scale);
    transformControls.attach(group);
  }, [transformControlsState]);

  useEffect(() => {
    if (focusOn.length === 0) {
      setTransformControls(undefined);
      return;
    }

    const elementGroups: Group[] = [];
    const boxHelpers: BoxHelper[] = [];
    const elementWrapperGroup = new Group();
    const boxHelperWrapperGroup = new Group();
    const newWrapperGroup = new Group();
    newWrapperGroup.userData = {
      elementSize: 0,
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
        const __element = elements.get(elementId)?.current;
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
        const __element = elements.get(elementId)?.current;
        const __position = new Vector3();
        __element?.getWorldPosition(__position);
        __position.sub(center);
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
    boxHelperWrapperGroup.position.copy(center.multiplyScalar(-1));

    const transformControls = new TransformControls(camera, gl.domElement);
    transformControls.attach(newWrapperGroup);
    scene.add(transformControls);
    setTransformControls(transformControls);

    return () => {
      transformControls.detach();
      scene.remove(transformControls);

      for (let elementId of ([] as string[]).concat(...childrenElementIds)) {
        let __worldElement = elements.get(elementId)?.current;
        if (__worldElement === undefined) continue;
        const __elementPosition = new Vector3();
        const __elementQuaternion = new Quaternion();
        const __elementScale = new Vector3();
        __worldElement.getWorldPosition(__elementPosition);
        __worldElement.getWorldQuaternion(__elementQuaternion);
        __worldElement.getWorldScale(__elementScale);
        __worldElement.removeFromParent();
        scene.add(__worldElement);
        __worldElement.position.copy(__elementPosition);
        __worldElement.quaternion.copy(__elementQuaternion);
        __worldElement.scale.copy(__elementScale);
      }

      scene.remove(...elementGroups);
      scene.remove(...boxHelpers);
      scene.remove(elementWrapperGroup);
      scene.remove(boxHelperWrapperGroup);
      scene.remove(newWrapperGroup);
    };
  }, [focusOn, elementStates]);

  return transformControls;
};

export default useTransformControls;
