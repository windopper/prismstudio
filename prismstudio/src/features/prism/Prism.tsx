import PrismControls from "./PrismControls";
import ConfigurePanel from "./panel/ConfigurePanel";
import { Canvas } from "@react-three/fiber";
import './Prism.css'
import usePrismKeyEvent from "./hooks/usePrismKeyEvent";

const GRID_SIZE = 30;

function Prism() {
  usePrismKeyEvent();

  return (
    <>
      <ConfigurePanel />
      <Canvas className="absolute w-100 h-100">
        <ambientLight color={"gray"} />
        <gridHelper args={[GRID_SIZE, GRID_SIZE * 16, 0x262626, 0x262626]} />
        <gridHelper args={[GRID_SIZE, GRID_SIZE, 0x696969, 0x696969]} />
        <axesHelper args={[-GRID_SIZE]} />
        <axesHelper args={[GRID_SIZE]} />
        <PrismControls />
        
      </Canvas>
    </>
  );
}

export default Prism;
