import './App.css';
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import BasicBoxComponent from './components/BasicBoxComponent';

function App() {
  return (
    <>
      <Canvas>
        <OrbitControls enableDamping={false}/>
        <ambientLight color={'gray'}/>
        <gridHelper args={[100, 100]} />
        <axesHelper args={[-100]} />
        <axesHelper args={[100]} />
        <BasicBoxComponent position={[0.5, 0.5, 0.5]}/>
      </Canvas>
    </>
  );
}

export default App;
