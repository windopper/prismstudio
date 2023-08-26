import React from 'react'
import { ElementState, focusComponent } from '../prismSlice'
import { useDispatch } from 'react-redux';

export interface ElementItemProp {
    elementState: ElementState,
    isFocused: boolean,
}

export default function ElementItem({elementState, isFocused}: ElementItemProp) {
  const dispatch = useDispatch();

  const focusElementItem = () => {
    dispatch(focusComponent({id: elementState.currentComponentId}))
  }

  return (
    <div className={`flex flex-row hover:opacity-75 ${isFocused && 'prism-component-text-color'} hover:cursor-pointer`} onClick={focusElementItem}>
        <div>▲ </div>
        <div>component-{elementState.id}</div>
    </div>
  )
}
