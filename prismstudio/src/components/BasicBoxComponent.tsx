import { useHelper } from "@react-three/drei";
import { MeshProps } from "@react-three/fiber";
import { useRef, useState } from "react";
import { BoxGeometry, BoxHelper, Color, Mesh, Object3D, Vector3 } from "three";
import ArrowsComponent from "./ArrowsComponent";

export default function BasicBoxComponent(props: MeshProps) {
    const { position } = props;

    const [hover, setHover] = useState(false);
    const [focus, setFocus] = useState(false);
    const mesh = useRef<Mesh>(null!);

    useHelper(mesh, BoxHelper, Color.NAMES.gray)

    console.log(position);

    return (
        <>
        <mesh 
            {...props}
            onPointerOver={(e) => setHover(true)}
            onPointerOut={(e) => setHover(false)}
            onClick={(e) => setFocus(false)}
            ref={mesh}
            >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial transparent={true} opacity={0}/>
        </mesh>
        <ArrowsComponent origin={new Vector3(0, 0, 0)}/>
        </>
    )
}