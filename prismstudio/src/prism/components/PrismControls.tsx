import { OrbitControls } from "@react-three/drei";
import { useSelector } from "react-redux";
import { ElementState } from "../redux/prismSlice";
import { RootState } from "../../store";
import { useRef } from "react";
import PrismTransformControls from "./PrismTransformControls";
import BoxMesh from "./BoxMesh";

export default function PrismControls() {
  const {
    orbitControlState,
    elementStates,
  } = useSelector((state: RootState) => {
    return state.prismSlice;
  });

  const elementRefs = useRef<Map<string, any>>(new Map());
  const { allIds } = elementStates;

  return (
    <>
      {allIds.map((v) => {
        return (
          <BoxMesh
            ref={elem => (elementRefs.current.set(v, elem))}
            key={v}
            elementId={v}
          />
        );
      })}
      <PrismTransformControls elementRefs={elementRefs} />
      <OrbitControls enableDamping={false} enabled={orbitControlState} />
    </>
  );
}
