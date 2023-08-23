import React from 'react'
import { ElementState } from './prismSlice';
import { TransformControls } from '@react-three/drei';
import BoxMesh from './BoxMesh';

interface Prop {
    groupId: number,
    elements: ElementState[]
}

//TODO BoxWithTransformControls 컴포넌트와 병합할 것
const GroupBoxWithTransformControls = ({groupId, elements}: Prop) => {

  return (
    <TransformControls>
        <group>
            {elements.map((v, i) => {
                return <BoxMesh id={v.id} isGrouped={true} key={v.id} />
            })}
        </group>
    </TransformControls>
  )
}

export default GroupBoxWithTransformControls;
