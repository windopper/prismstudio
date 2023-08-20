import { useHelper } from "@react-three/drei";
import { useRef, useState } from "react";
import { BoxHelper, Mesh, Vector3 } from "three";
import ArrowComponent from "./ArrowComponent";

interface Prop {
  origin: Vector3 | undefined;
}

export default function ArrowsComponent({ origin }: Prop) {

  const directions: Vector3[] = [
    new Vector3(1, 0, 0),
    new Vector3(0, 1, 0),
    new Vector3(0, 0, 1),
    new Vector3(-1, 0, 0),
    new Vector3(0, -1, 0),
    new Vector3(0, 0, -1),
  ];

  const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xff0000, 0x00ff00, 0x0000ff];

  return (
    <>
      {directions.map((v, i) => (
        <ArrowComponent direction={v} origin={origin} color={colors[i]}/>
      ))}
    </>
  );
}
