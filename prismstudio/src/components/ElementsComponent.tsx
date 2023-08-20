import { OrbitControls, TransformControls } from "@react-three/drei";
import ElementComponent from "./ElementComponent";
import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { useSelector } from "react-redux";
import { ElementState } from "../features/prism/prismSlice";
import { RootState } from "../store";

export default function ElementsComponent() {
  const { elements, focusOn } = useSelector((state: RootState) => {
    return state.prismSlice;
  });
  const { orbitControlState } = useSelector((state: RootState) => {
    return state.globalSlice
  })

  return (
    <>
      {elements.map((v: ElementState, i: number) => {
        return (
          <ElementComponent key={v.id} id={v.id} isFocusOn={v.id === focusOn} />
        );
      })}
      <OrbitControls enableDamping={false} enabled={orbitControlState} />
    </>
  );
}
