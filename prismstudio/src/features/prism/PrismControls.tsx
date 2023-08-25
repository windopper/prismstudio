import { OrbitControls, TransformControls } from "@react-three/drei";
import BoxWithTransformControls from "./BoxWithTransformControls";
import { useDispatch, useSelector } from "react-redux";
import { ElementState, GroupElementState, focusComponent, toggleGroupSelectionElements } from "./prismSlice";
import { RootState } from "../../store";
import { Group, Mesh } from "three";
import GroupBoxWithTransformControls from "./GroupBoxWithTransformControls";
import { useCallback, useEffect, useRef } from "react";
import PrismTransformControls from "./PrismTransformControls";
import BoxMesh from "./BoxMesh";

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

  const focusRef = useRef<Mesh>(null!);
  const controlRef = useRef<any>(null!);
  
  useEffect(() => {
    controlRef.current?.attach(focusRef.current);
  }, [focusOn])

  return (
    <>
      {elements.map((v: ElementState, i: number) => {
        let isGrouped: number | undefined = currentGroupSelectionElements.find(
          (_v) => _v === v.id
        );
        // return (
        //   <BoxWithTransformControls
        //     key={v.id}
        //     id={v.id}
        //     enableTransformControl={v.id === focusOn}
        //     transformControlsMode={transformControlsMode}
        //     isGrouped={isGrouped !== undefined}
        //   />
        // );
        return (
          <BoxMesh
            isGrouped={isGrouped !== undefined}
            ref={v.id === focusOn ? focusRef : null}
            key={v.id}
            id={v.id}
          />
        );
      })}
      {/* {groupElements.map((v: GroupElementState, i: number) => {
        return (
          <GroupBoxWithTransformControls
            key={v.id}
            groupId={v.id}
            elements={v.elements}
            enableTransformControl={v.id === focusOn}
            transformControlsMode={transformControlsMode}
          />
        );
      })} */}
      <PrismTransformControls focusOn={focusOn} ref={controlRef}/>
      <OrbitControls enableDamping={false} enabled={orbitControlState} />
    </>
  );
}
