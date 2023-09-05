import React, { forwardRef, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { focusComponent } from "prism/redux/prismSlice";
import { RootState } from "store";
import { useThree } from "@react-three/fiber";

interface Prop {
  elementId: string,
}

const BoxMesh = React.memo(
  forwardRef((props: Prop, ref: any) => {
    const meshRef = useRef<any>();
    const { elementId } = props;

    const { scene } = useThree();
    const elementState = useSelector((state: RootState) => state.prismSlice.elementStates.byId[elementId]);
    const wrapComponent = useSelector((state: RootState) => state.prismSlice.components.byId[elementState.wrapComponentId]);
    const groupComponent = useSelector((state: RootState) => state.prismSlice.components.byId[wrapComponent.topPointer]);
    const dispatch = useDispatch();

    const onFocus = useCallback(() => {
      dispatch(focusComponent({ componentId: wrapComponent.id }))
    }, [dispatch, wrapComponent.id]);

    /* TODO 월드 좌표로 움직이게 만들기 */
    useEffect(() => {
      console.log('update ' + elementId)
      const { position, scale, rotate } = elementState;
      console.log(meshRef)
      const parent = meshRef.current?.parent;
      scene.attach(meshRef.current);
      meshRef.current?.position.set(...position)
      parent.attach(meshRef.current);
    }, [elementState])

    return (
      <mesh onClick={onFocus} ref={(el) => {
        ref(el);
        meshRef.current = el;
      }}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={"#0050d1"}
          opacity={wrapComponent.isFocused ? 0.7 : 1}
          transparent={true}
          wireframe={wrapComponent.isFocused}
        />
      </mesh>
    );
  })
);

export default BoxMesh;
