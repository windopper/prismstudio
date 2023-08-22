import React from 'react'
import { ElementState } from './prismSlice';
import { TransformControls } from '@react-three/drei';

interface Prop {
    groupId: number,
    elements: ElementState[]
}

const GroupBoxWithTransformControls = ({groupId, elements}: Prop) => {
  return (
    <TransformControls>
        <group>
            {elements.map((v, i) => {
                return <>
                </>
            })}
        </group>
    </TransformControls>
  )
}

export default GroupBoxWithTransformControls;
