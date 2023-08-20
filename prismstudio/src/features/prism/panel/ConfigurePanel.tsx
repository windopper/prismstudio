import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  ElementState,
  addNewComponent,
  deleteFocusedComponent,
} from "../prismSlice"
import DropDown from "../../../utils/DropDown";
import ElementItem from "./ElementItem";

export default function ConfigurePanel() {
  const dispatch = useDispatch();

  const { elements, focusOn } = useSelector((state: RootState) => {
    return state.prismSlice;
  });

  const onClickCreateComponent = () => {
    dispatch(addNewComponent());
  };

  const onClickDeleteComponent = () => {
    dispatch(deleteFocusedComponent());
  };

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
      </div>
      <DropDown dropDownName="components" defaultOpenState={true}>
        {elements.map((v: ElementState) => {
          return <ElementItem state={v} isFocused={focusOn === v.id}/>;
        })}
      </DropDown>
    </div>
  );
}
