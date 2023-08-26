import { OrbitControls } from "@react-three/drei";
import { useSelector } from "react-redux";
import { ElementState } from "./prismSlice";
import { RootState } from "../../store";
import { useRef } from "react";
import PrismTransformControls from "./PrismTransformControls";
import BoxMesh from "./BoxMesh";

export default function PrismControls() {
  const {
    orbitControlState,
    elementStates
  } = useSelector((state: RootState) => {
    return state.prismSlice;
  });

  const elementRefs = useRef<Map<number, any>>(new Map());

  return (
    <>
      {elementStates.map((v: ElementState, i: number) => {
        return (
          <BoxMesh
            ref={elem => (elementRefs.current.set(v.id, elem))}
            key={v.id}
            elementId={v.id}
            componentId={v.currentComponentId}
          />
        );
      })}
      <PrismTransformControls elementRefs={elementRefs} />
      <OrbitControls enableDamping={false} enabled={orbitControlState} />
    </>
  );
}
