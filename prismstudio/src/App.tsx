import "./App.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ElementsComponent from "./components/ElementsComponent";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { increase, decrease } from "./features/test/testSlice";
import { addNewComponent } from "./features/prism/prismSlice";

function App() {
  const dispatch = useDispatch();
  
  const onAddNewComponent = () => {
    dispatch(addNewComponent())
  }

  return (
    <>
      <div className="absolute top-2 left-2 flex flex-row">
        <button onClick={onAddNewComponent}>add component</button>
      </div>
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
