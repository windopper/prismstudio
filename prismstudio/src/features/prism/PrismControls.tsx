import { OrbitControls } from "@react-three/drei";
import BoxWithTransformControls from "./BoxWithTransformControls";
import { useSelector } from "react-redux";
import { ElementState } from "./prismSlice";
import { RootState } from "../../store";

export default function PrismControls() {
  const { orbitControlState, elements, focusOn } = useSelector((state: RootState) => {
    return state.prismSlice;
  });

  return (
    <>
      {elements.map((v: ElementState, i: number) => {
        return (
          <BoxWithTransformControls key={v.id} id={v.id} enableTransformControl={v.id === focusOn} />
        );
      })}
      <OrbitControls enableDamping={false} enabled={orbitControlState} />
    </>
  );
}
