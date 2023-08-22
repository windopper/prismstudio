import { OrbitControls, TransformControls } from "@react-three/drei";
import BoxWithTransformControls from "./BoxWithTransformControls";
import { useSelector } from "react-redux";
import { ElementState, GroupElementState } from "./prismSlice";
import { RootState } from "../../store";
import { Group } from "three";
import GroupBoxWithTransformControls from "./GroupBoxWithTransformControls";

export default function PrismControls() {
  const { transformControlsMode, orbitControlState, elements, focusOn, groupElements } =
    useSelector((state: RootState) => {
      return state.prismSlice;
    });

  return (
    <>
      {elements.map((v: ElementState, i: number) => {
        return (
          <BoxWithTransformControls
            key={v.id}
            id={v.id}
            enableTransformControl={v.id === focusOn}
            transformControlsMode={transformControlsMode}
          />
        );
      })}
      {groupElements.map((v: GroupElementState, i: number) => {
        return (
          <GroupBoxWithTransformControls groupId={v.id} elements={v.elements} key={i}/>
        )
      })}
      <OrbitControls enableDamping={false} enabled={orbitControlState} />
    </>
  );
}
