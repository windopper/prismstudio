import { OrbitControls } from "@react-three/drei";
import { useSelector } from "react-redux";
import { ElementState } from "prism/redux/prismSlice";
import { RootState } from "store";
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
  const { allIds } = elementStates;

  return (
    <>
      {allIds.map((v) => {
        return (
          <BoxMesh
            key={v}
            elementId={v}
          />
        );
      })}
      <PrismTransformControls />
      <OrbitControls enableDamping={false} enabled={orbitControlState} />
    </>
  );
}
