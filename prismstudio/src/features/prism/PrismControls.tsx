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

  const elementRefs = useRef<Map<string, any>>(new Map());
  const { allIds } = elementStates;

  return (
    <>
      {allIds.map((v) => {
        const elementState = elementStates.byId[v];
        return (
          <BoxMesh
            ref={elem => (elementRefs.current.set(elementState.id, elem))}
            key={elementState.id}
            elementId={elementState.id}
            componentId={v.currentComponentId}
            isFocused={v.isFocused}
          />
        );
      })}
      <PrismTransformControls elementRefs={elementRefs} />
      <OrbitControls enableDamping={false} enabled={orbitControlState} />
    </>
  );
}
