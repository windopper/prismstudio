import { OrbitControls, TransformControls } from "@react-three/drei";
import BoxWithTransformControls from "./BoxWithTransformControls";
import { useSelector } from "react-redux";
import { ElementState, GroupElementState } from "./prismSlice";
import { RootState } from "../../store";
import { Group } from "three";
import GroupBoxWithTransformControls from "./GroupBoxWithTransformControls";

export default function PrismControls() {
  const {
    transformControlsMode,
    orbitControlState,
    elements,
    focusOn,
    groupElements,
    currentGroupSelectionElements,
  } = useSelector((state: RootState) => {
    return state.prismSlice;
  });

  return (
    <>
      {elements.map((v: ElementState, i: number) => {
        let isGrouped: number | undefined = currentGroupSelectionElements.find(
          (_v) => _v === v.id
        );
        return (
          <BoxWithTransformControls
            key={v.id}
            id={v.id}
            enableTransformControl={v.id === focusOn}
            transformControlsMode={transformControlsMode}
            isGrouped={isGrouped !== undefined}
          />
        );
      })}
      {groupElements.map((v: GroupElementState, i: number) => {
        return (
          <GroupBoxWithTransformControls
            key={v.id} 
            groupId={v.id}
            elements={v.elements}
            enableTransformControl={v.id === focusOn}
            transformControlsMode={transformControlsMode}
          />
        );
      })}
      <OrbitControls enableDamping={false} enabled={orbitControlState} />
    </>
  );
}
