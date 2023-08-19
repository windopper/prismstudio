import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function App() {
  return (
    <>
      <Canvas>
        <mesh>
          <OrbitControls />
          <boxGeometry args={[1, 1, 1]} />
        </mesh>
      </Canvas>
    </>
  );
}

export default App;
