import "./App.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ElementsComponent from "./components/ElementsComponent";
import { useRef } from "react";

function App() {

  return (
    <>
      <Canvas>
        
        <ambientLight color={"gray"} />
        <gridHelper args={[100, 100]} />
        <axesHelper args={[-100]} />
        <axesHelper args={[100]} />
        <ElementsComponent />
      </Canvas>
    </>
  );
}

export default App;
