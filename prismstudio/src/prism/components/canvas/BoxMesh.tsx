import React, { forwardRef, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { focusComponent } from "prism/redux/prismSlice";
import { RootState } from "store";
import { useThree } from "@react-three/fiber";
import { Mesh } from "three";

export const boxMeshs = new Map<string, React.MutableRefObject<Mesh | undefined>>();

interface Prop {
  elementId: string;
}

const BoxMesh = React.memo(
  (props: Prop) => {
    const meshRef = useRef<Mesh>();
    const { elementId } = props;

    const { scene } = useThree();
    const elementState = useSelector(
      (state: RootState) => state.prismSlice.elementStates.byId[elementId]
    );
    const wrapComponent = useSelector(
      (state: RootState) =>
        state.prismSlice.components.byId[elementState.wrapComponentId]
    );
    const dispatch = useDispatch();

    const onFocus = useCallback(() => {
      dispatch(focusComponent({ componentId: wrapComponent.id }));
    }, [dispatch, wrapComponent.id]);

    useEffect(() => {
      const { position, scale, rotate } = elementState;
      const parent = meshRef.current?.parent;
      scene.attach(meshRef.current as any);
      meshRef.current?.position.set(...position);
      meshRef.current?.rotation.set(...rotate);
      meshRef.current?.scale.set(...scale);
      parent?.attach(meshRef.current as any);
    }, [elementState]);

    useEffect(() => {
      boxMeshs.set(elementId, meshRef);

      return () => {
        boxMeshs.delete(elementId);
      }
    }, [])

    return (
      <mesh
        onClick={onFocus}
        ref={(el) => {
          meshRef.current = el as Mesh;
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={"#0050d1"}
          opacity={wrapComponent.isFocused ? 0.7 : 1}
          transparent={true}
          wireframe={wrapComponent.isFocused}
        />
      </mesh>
    );
  });

export default BoxMesh;
