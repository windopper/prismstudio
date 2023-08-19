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
        {/* <pointLight position={[10, 10, 10]} /> */}
        <gridHelper args={[100, 100]} />
        <axesHelper args={[100]} rotation={[0, Math.PI, 0]}/>
        <axesHelper args={[100]} />
        {/* <mesh position={[0.5, 0.5, 0.5]}>
          <boxGeometry args={[1, 1]} />
        </mesh> */}
        <BasicBoxComponent position={[0.5, 0.5, 0.5]}/>
      </Canvas>
    </>
  );
}

export default App;
