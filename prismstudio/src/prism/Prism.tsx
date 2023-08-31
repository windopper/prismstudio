import PrismControls from "./components/PrismControls";
import ConfigurePanel from "./components/panel/ConfigurePanel";
import { Canvas } from "@react-three/fiber";
import './Prism.css'
import usePrismKeyEvent from "./hooks/usePrismKeyEvent";
import { useDispatch } from "react-redux";
import { outFocusComponent } from "./redux/prismSlice";
import { GRID_SIZE } from "./constants";

function Prism() {
  const dispatch = useDispatch();
  usePrismKeyEvent();

  const onPointerMissed = () => {
    dispatch(outFocusComponent({}));
  }

  return (
    <>
      <ConfigurePanel />
      <Canvas className="absolute w-100 h-100" onPointerMissed={onPointerMissed}>
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
