import React from 'react'
import { ElementState, focusComponent } from '../prismSlice'
import { useDispatch } from 'react-redux';

export interface ElementItemProp {
    state: ElementState,
    isFocused: boolean,
}

export default function ElementItem({state, isFocused}: ElementItemProp) {
  const dispatch = useDispatch();

  const focusElementItem = () => {
    dispatch(focusComponent({id: state.id}))
  }

  return (
    <div className={`flex flex-row hover:opacity-75 ${isFocused && 'prism-component-text-color'}`} onClick={focusElementItem}>
        <div>▲</div>
        <div>component</div>
        <div>{state.position}</div>
    </div>
  )
}
