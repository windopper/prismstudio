import { useHelper } from "@react-three/drei";
import { MeshProps } from "@react-three/fiber";
import { useRef, useState } from "react";
import { BoxGeometry, BoxHelper, Color, Mesh, Object3D } from "three";

export default function BasicBoxComponent(props: MeshProps) {
    const [hover, setHover] = useState(false);
    const mesh = useRef<Mesh>(null!);

    useHelper(mesh, BoxHelper, Color.NAMES.gray)

    return (
        <mesh 
            {...props}
            onPointerOver={(e) => setHover(true)}
            onPointerOut={(e) => setHover(false)}
            ref={mesh}
            >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial transparent={true} opacity={0}/>
        </mesh>
    )
}