import { OrbitControls, TransformControls } from "@react-three/drei";
import BasicBoxComponent from "./BasicBoxComponent";
import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";

export default function ElementsComponent() {
  const [enableOrbitControl, setEnableOrbitControl] = useState(true);

  return (
    <>
      <TransformControls
        onMouseDown={(e) => setEnableOrbitControl(false)}
        onMouseUp={(e) => setEnableOrbitControl(true)}
      >
        <BasicBoxComponent />
      </TransformControls>
      <OrbitControls
        enableDamping={false}
        enabled={enableOrbitControl}
      />
    </>
  );
}
