import { Vector3 } from "three"

interface Prop {
    origin: Vector3 | undefined
}

export default function ArrowsComponent({origin}: Prop) {
    const xDir = new Vector3(1, 0, 0);
    const yDir = new Vector3(0, 1, 0);
    const zDir = new Vector3(0, 0, 1);

    const nxDir = new Vector3(-1, 0, 0);
    const nyDir = new Vector3(0, -1, 0);
    const nzDir = new Vector3(0, 0, -1);

    return (
        <mesh>
            <arrowHelper args={[xDir, origin, 0.7, 0xff0000, 0.2, 0.2]}/>
            <arrowHelper args={[yDir, origin, 0.7, 0x00ff00, 0.2, 0.2]}/>
            <arrowHelper args={[zDir, origin, 0.7, 0x0000ff, 0.2, 0.2]}/>
            <arrowHelper args={[nxDir, origin, 0.7, 0xff0000, 0.2, 0.2]}/>
            <arrowHelper args={[nyDir, origin, 0.7, 0x00ff00, 0.2, 0.2]}/>
            <arrowHelper args={[nzDir, origin, 0.7, 0x0000ff, 0.2, 0.2]}/>
        </mesh>
    )
}