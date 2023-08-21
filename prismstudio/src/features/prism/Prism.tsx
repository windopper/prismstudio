import PrismControls from "./PrismControls";
import ConfigurePanel from "./panel/ConfigurePanel";
import { Canvas } from "@react-three/fiber";
import './Prism.css'
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { outFocusComponent } from "./prismSlice";
import usePrismKeyEvent from "./hooks/usePrismKeyEvent";

function Prism() {
  usePrismKeyEvent();

  return (
    <>
      <ConfigurePanel />
      <Canvas className="absolute w-100 h-100">
        <ambientLight color={"gray"} />
        <gridHelper args={[100, 1600, 0x262626, 0x262626]} />
        <gridHelper args={[100, 100, 0x696969, 0x696969]} />
        <axesHelper args={[-100]} />
        <axesHelper args={[100]} />
        <PrismControls />
      </Canvas>
    </>
  );
}

export default Prism;
