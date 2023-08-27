import React, { useEffect, useState } from "react";
import { Component, ElementState, focusComponent } from "../prismSlice";
import { useDispatch, useSelector } from "react-redux";
import BoxOutline from "../svg/BoxOutline";
import { RootState } from "../../../store";

export interface ComponentItemProp {
  component: Component;
  isFocused: boolean;
}

export default function ComponentItem({
  component,
  isFocused,
}: ComponentItemProp) {
  const [isCollectionOpen, setCollectionOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isFocused && isCollectionOpen) setCollectionOpen(false);
  }, [isFocused])

  const elementStates = useSelector((state: RootState) => {
    return state.prismSlice.elementStates.filter(
      (v) => v.currentComponentId === component.id
    );
  });

  const onFocusComponent = () => {
    dispatch(focusComponent({ id: component.id }));
  };

  console.log(elementStates.length);

  return (
    <>
      {elementStates.length == 1 ? (
        <div
          className={`flex flex-row hover:opacity-75 ${
            isFocused && "prism-component-text-color"
          } hover:cursor-pointer items-center`}
          onClick={onFocusComponent}
        >
          <BoxOutline isFocus={isFocused} />
          <div>{elementStates[0].name}</div>
        </div>
      ) : (
        <div className="ml-2">
          <div
            className={`mb-1 hover:cursor-pointer hover:opacity-75 ${
              isCollectionOpen && "text-green-500"
            }`}
            onClick={() => setCollectionOpen((s) => !s)}
          >
            {component.name}
          </div>
          {isCollectionOpen && (
            <div className="ml-2 flex flex-col gap-2">
              {elementStates.map((v) => (
                <div
                  className={`flex flex-row hover:opacity-75 ${
                    isFocused && "prism-component-text-color"
                  } hover:cursor-pointer items-center`}
                  onClick={onFocusComponent}
                >
                  <BoxOutline isFocus={isFocused} />
                  <div>{v.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
