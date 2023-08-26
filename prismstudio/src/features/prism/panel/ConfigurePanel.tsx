import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  ElementState,
  addNewComponent,
  attachGroupComponents,
  deleteFocusedComponent,
  detachGroupComponents,
} from "../prismSlice"
import DropDown from "../../../utils/DropDown";
import ElementItem from "./ElementItem";
import GroupItem from "./GroupItem";
import StatusItem from "./StatusItem";

export default function ConfigurePanel() {
  const dispatch = useDispatch();

  const { elementStates, focusOn, components } = useSelector((state: RootState) => {
    return state.prismSlice;
  });

  const focusedComponent = components.find(v => v.id === focusOn);

  const onClickCreateComponent = () => {
    dispatch(addNewComponent());
  };

  const onClickDeleteComponent = () => {
    dispatch(deleteFocusedComponent());
  };

  const onClickAttachGroup = () => {
    dispatch(attachGroupComponents());
  }

  const onClickDetachGroup = () => {
    dispatch(detachGroupComponents());
  }

  return (
    <div className="absolute top-0.5 right-0.5 flex flex-col z-10 m-2 bg-black rounded-lg items-center">
      <div className="flex flex-row">
        <button
          className="bg-black rounded-lg text-gray-200 m-1 p-1 hover:bg-white/25"
          onClick={onClickCreateComponent}
        >
          create component
        </button>
        <button
          className="bg-black rounded-lg text-gray-200 m-1 p-1 hover:bg-white/25"
          onClick={onClickDeleteComponent}
        >
          delete component
        </button>
        <button
          className="bg-black rounded-lg text-gray-200 m-1 p-1 hover:bg-white/25"
          onClick={onClickAttachGroup}
        >
          group component
        </button>
        <button
          className="bg-black rounded-lg text-gray-200 m-1 p-1 hover:bg-white/25"
          onClick={onClickDetachGroup}
        >
          detach component
        </button>
      </div>
      <DropDown dropDownName="components" defaultOpenState={true}>
        {elementStates.map((v: ElementState, i) => {
          return (
            <ElementItem
              elementState={v}
              isFocused={focusOn === v.currentComponentId}
              key={v.id}
            />
          );
        })}
      </DropDown>
      {focusOn && focusedComponent && (
        <DropDown dropDownName="그룹" defaultOpenState={true}>
          {focusedComponent.elementIds.map((v, i) => {
            const state = elementStates.find(elementState => elementState.id === v)
            if (state === undefined) return null;
            return (
              <GroupItem
                elementState={state}
                isFocused={true}
                key={state.id}
              />
            )
          })}
        </DropDown>
      )}
      {focusOn && focusedComponent &&  (
        <DropDown dropDownName="상태" defaultOpenState={true}>
          <StatusItem focusedComponent={focusedComponent}/>
        </DropDown>
      )}
    </div>
  );
}
