import { TransformControls } from "@react-three/drei";
import React, { forwardRef, useCallback, useEffect, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Box3Helper, BoxHelper, Event, Group, Mesh, Quaternion, Vector3 } from "three";
import {
  Component,
  toggleOrbitControl,
  updateElementStates,
} from "./prismSlice";
import { RootState } from "../../store";
import { useThree } from "@react-three/fiber";

const TRANSLATION_SNAP = 0.03125;

export interface PrismTransformControlsProps {
  elementRefs: React.MutableRefObject<Mesh[]>,
  onUpdate?: (e: Event | undefined) => void,
}

const PrismTransformControls = React.memo(
  (props: PrismTransformControlsProps) => {
    const {
      elementRefs,
      onUpdate,
    } = props;

    const { scene } = useThree();
    const dispatch = useDispatch();
    const controlRef = useRef<any>(null!);

    const { transformControlsMode, focusOn, focusedComponent } = useSelector((state: RootState) => {
      const { transformControlsMode, focusOn } = state.prismSlice;
      const focusedComponent = state.prismSlice.components.find(v => v.id === focusOn);
      return {
        transformControlsMode,
        focusOn,
        focusedComponent,
      }
    }, shallowEqual)

    const stopOrbitControls = useCallback(() => {
      dispatch(toggleOrbitControl(false));
    }, [dispatch]);

    const startOrbitControls = useCallback(() => {
      dispatch(toggleOrbitControl(true));
    }, [dispatch]);

    useEffect(() => {
      //console.log(controlRef);
      //console.log(elementRefs.current)
      if (focusOn === undefined) return;
      if (focusedComponent?.elementIds === undefined) return;

      const group = new Group();

      for (let elementId of focusedComponent?.elementIds) {
        group.add(elementRefs.current[elementId])
        elementRefs.current[elementId].addEventListener('', (event) => {

        });
      }
      scene.add(group);
      
      const box = new BoxHelper(group, 0xffff00);
      scene.add(box);
      //console.log(controlRef.current);
      controlRef.current.attach(group)
      const groupPosition = group.getWorldPosition(new Vector3());
      console.log(controlRef.current);
      controlRef.current.position.set(2, 2, 2)
      controlRef.current.updateMatrix();

      controlRef.current.addEventListener("change", (event: THREE.Event) => {
        //console.log(event.target);
      })

      const onDraggingChanged = (event: THREE.Event) => {
        if (event.target?.dragging == false) {
          const updatingElementStates: any[] = []
          for (let elementId of focusedComponent?.elementIds) {
            //console.log(elementId);
            let worldElement = scene.getObjectById(elementRefs.current[elementId].id)
            if (worldElement === undefined) continue;
            let elementPosition = worldElement?.getWorldPosition(new Vector3());
            let elementQuaternion = worldElement?.getWorldQuaternion(new Quaternion());
            let elementScale = worldElement?.getWorldScale(new Vector3());
            updatingElementStates.push({
              elementId,
              position: [elementPosition.x, elementPosition.y, elementPosition.z],
              rotate: [0, 0, 0],
              scale: [elementScale.x, elementScale.y, elementScale.z],
            });
          }
          dispatch(updateElementStates(updatingElementStates))
        }
      }

      controlRef.current?.addEventListener('dragging-changed', onDraggingChanged)

      return () => {
        controlRef.current?.removeEventListener('dragging-changed', onDraggingChanged);
        for (let elementId of focusedComponent?.elementIds) {
          let worldElement = scene.getObjectById(elementRefs.current[elementId].id)
          let elementPosition = worldElement?.getWorldPosition(new Vector3());
          let elementQuaternion = worldElement?.getWorldQuaternion(new Quaternion());
          let elementScale = worldElement?.getWorldScale(new Vector3());
          elementRefs.current[elementId].removeFromParent();
          scene.add(elementRefs.current[elementId])

          worldElement?.position.copy(elementPosition!);
          worldElement?.quaternion.copy(elementQuaternion!);
          worldElement?.scale.copy(elementScale!);
        }
        controlRef.current?.dispose();
        scene.remove(box);
        //scene.remove(group);
        //console.log('detach');
      }
    }, [focusOn])

    return (
      <>
      {focusOn != undefined ?
        <TransformControls
          onMouseDown={stopOrbitControls}
          onMouseUp={startOrbitControls}
          // onUpdate={console.log}
          //onChange={console.log}
          onUpdate={console.log}
          translationSnap={TRANSLATION_SNAP}
          mode={transformControlsMode}
          ref={controlRef}

          //position={[0.5, 0.5, 0.5]}
        /> : null}</>
    );
  }
);

export default PrismTransformControls;
