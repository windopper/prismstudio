import { TransformControls, useHelper } from "@react-three/drei";
import { forwardRef, useRef, useState } from "react";
import { BoxHelper, Color, Mesh } from "three";

const BasicBoxComponent = (
  props: any,
  ref: any
) => {
  const [focus, setFocus] = useState(true);
  const mesh = useRef<Mesh>(null!);

  useHelper(mesh, BoxHelper, Color.NAMES.gray);

  return (
    <>
        <mesh onClick={(e) => setFocus(true)} ref={mesh}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial transparent={true} opacity={0} />
        </mesh>
    </>
  );
};

export default BasicBoxComponent;
