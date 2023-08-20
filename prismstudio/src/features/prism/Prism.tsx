import PrismControls from "./PrismControls";
import ConfigurePanel from "./panel/ConfigurePanel";
import { Canvas } from "@react-three/fiber";
import './Prism.css'
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { outFocusComponent } from "./prismSlice";

function Prism() {
    const dispatch = useDispatch();

    const onPressESC = useCallback((e: KeyboardEvent) => {
        if (e.key == 'Escape') dispatch(outFocusComponent())
    }, [dispatch])

    useEffect(() => {
        window.addEventListener("keydown", onPressESC)
        return () => {
            window.removeEventListener("keydown", onPressESC);
        }
    }, [])

  return (
    <>
      <ConfigurePanel />
      <Canvas className="absolute w-100 h-100">
        <ambientLight color={"gray"} />
        <gridHelper args={[100, 100]} />
        <gridHelper args={[100, 800, 0x000000, 0x000000]} />
        <axesHelper args={[-100]} />
        <axesHelper args={[100]} />
        <PrismControls />
      </Canvas>
    </>
  );
}

export default Prism;
