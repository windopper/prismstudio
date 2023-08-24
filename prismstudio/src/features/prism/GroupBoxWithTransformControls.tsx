import React from 'react'
import { ElementState } from './prismSlice';
import { TransformControls } from '@react-three/drei';
import BoxMesh from './BoxMesh';
import PrismTransformControls, { PrismTransformControlsProps } from './PrismTransformControls';
import { Event } from 'three';

interface Prop extends PrismTransformControlsProps {
    groupId: number,
    elements: ElementState[]
}

//TODO BoxWithTransformControls 컴포넌트와 병합할 것
const GroupBoxWithTransformControls = (props: Prop) => {
  const { enableTransformControl, transformControlsMode, elements, groupId } = props;

  const updatePosition = (e: Event | undefined) => {
      console.log('update Position')
  }

  return (
    <PrismTransformControls
      enableTransformControl={enableTransformControl}
      transformControlsMode={transformControlsMode}
      onUpdate={updatePosition}
    >
      <group>
        {elements.map((v, i) => {
          return <BoxMesh id={v.id} isGrouped={true} key={v.id} ref={null} position={v.position}/>;
        })}
      </group>
    </PrismTransformControls>
  );
}

export default GroupBoxWithTransformControls;
