import React from "react";
import {
  ElementState,
  detachComponentFromGroup,
  focusComponent,
} from "../prismSlice";
import { useDispatch } from "react-redux";

export interface ElementItemProp {
  elementState: ElementState;
  isFocused: boolean;
}

export default function GroupItem({
  elementState,
  isFocused,
}: ElementItemProp) {
  const dispatch = useDispatch();

  const focusElementItem = () => {
    dispatch(focusComponent({ id: elementState.currentComponentId }));
  };

  const onClickDetachFromGroup = () => {
    dispatch(detachComponentFromGroup({ elementId: elementState.id }));
  };

  return (
    <div
      className={`flex flex-row hover:opacity-75 ${
        isFocused && "prism-component-text-color"
      } hover:cursor-pointer items-center`}
      onClick={focusElementItem}
    >
      <div>▲ </div>
      <div>component-{elementState.id}</div>
      <button className="p-2" onClick={onClickDetachFromGroup}>
        그룹 해제
      </button>
    </div>
  );
}
