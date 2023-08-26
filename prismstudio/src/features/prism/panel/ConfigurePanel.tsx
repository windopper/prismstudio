import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  ElementState,
  addNewComponent,
  attachGroupComponents,
  deleteFocusedComponent,
} from "../prismSlice"
import DropDown from "../../../utils/DropDown";
import ElementItem from "./ElementItem";

export default function ConfigurePanel() {
  const dispatch = useDispatch();

  const { elementStates, focusOn } = useSelector((state: RootState) => {
    return state.prismSlice;
  });

  const onClickCreateComponent = () => {
    dispatch(addNewComponent());
  };

  const onClickDeleteComponent = () => {
    dispatch(deleteFocusedComponent());
  };

  const onClickAttachGroup = () => {
    dispatch(attachGroupComponents());
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
      </div>
      <DropDown dropDownName="components" defaultOpenState={true}>
        {elementStates.map((v: ElementState, i) => {
          return <ElementItem state={v} isFocused={focusOn === v.id} key={v.id}/>;
        })}
      </DropDown>
    </div>
  );
}
