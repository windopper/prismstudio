import React, { useEffect, useState } from "react";
import { SingleComponent, ElementState, focusComponent, GroupComponents } from "../prismSlice";
import { useDispatch, useSelector } from "react-redux";
import BoxOutline from "../svg/BoxOutline";
import { RootState } from "../../../store";

export interface ComponentItemProp {
  component: SingleComponent | GroupComponents;
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
    else if (isFocused) setCollectionOpen(true);
  }, [isFocused])

  const childComponents = useSelector((state: RootState) => {
    return Object.values(state.prismSlice.components.byId).filter(v => v.topPointer === component.id);
  });

  const onFocusComponent = () => {
    dispatch(focusComponent({ componentId: component.id, type: 'set' }));
  };

  console.log(`${component.id} ${isFocused}`);

  return (
    <>
      {component.type === "SingleComponent" ? (
        <div
          className={`flex flex-row hover:opacity-75 ${
            isFocused && "prism-component-text-color"
          } hover:cursor-pointer items-center`}
          onClick={onFocusComponent}
        >
          <BoxOutline isFocus={isFocused} />
          <div>{component.name}</div>
        </div>
      ) : (
        <div className="ml-2">
          <div
            className={`mb-2 hover:cursor-pointer hover:opacity-75 ${
              isCollectionOpen && "text-green-500"
            }`}
            onClick={() => setCollectionOpen((s) => !s)}
          >
            {component.name}
          </div>

          {isCollectionOpen && (
            <div className="ml-2 flex flex-col gap-2">
              {childComponents.map((v) => (
                <ComponentItem component={v} isFocused={v.isFocused} key={v.id}/>
              ))}
            </div>
          )}

        </div>
      )}
    </>
  );
}
