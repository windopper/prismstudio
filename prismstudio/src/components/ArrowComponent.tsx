import { useHelper } from "@react-three/drei";
import { useRef, useState } from "react";
import { BoxHelper, Mesh, Vector3 } from "three";

interface Prop {
  direction: Vector3;
  origin: Vector3 | undefined;
  color: any;
}

export default function ArrowComponent({ direction, origin, color }: Prop) {
  const [hover, setHover] = useState(true);
  const testRef = useRef<Mesh>(null!);
  useHelper(testRef, BoxHelper, "blue");

  return (
    <mesh
      position={origin}
      
      ref={testRef}
      >
        <lineBasicMaterial />
      <arrowHelper
        args={[direction, origin, 0.7, hover ? 0xffff00 : color, 0.2, 0.2]}
        // onPointerEnter={(e) => setHover(true)}
        // onPointerLeave={(e) => setHover(false)}
        onClick={(e) => setHover(true)}
        onDoubleClick={(e) => setHover(false)}
        
      />
    </mesh>
  );
}
