import React, { useEffect, useState } from "react";
import { SingleComponent, ElementState, focusComponent, GroupComponents } from "../prismSlice";
import { useDispatch, useSelector } from "react-redux";
import BoxOutline from "../svg/BoxOutline";
import { RootState } from "../../../store";

export interface ComponentItemProp {
  componentId: string,
}

function ComponentItem({
  componentId,
}: ComponentItemProp) {
  const [isCollectionOpen, setCollectionOpen] = useState(false);
  const dispatch = useDispatch();
  
  const component = useSelector((state: RootState) => {
    return state.prismSlice.components.byId[componentId];
  })
  
  useEffect(() => {
    if (!component.isFocused && isCollectionOpen) setCollectionOpen(false);
    else if (component.isFocused) setCollectionOpen(true);
  }, [component.isFocused])

  const onFocusComponent = () => {
    dispatch(focusComponent({ componentId: componentId, type: 'set' }));
  };
  
  return (
    <>
      {component.type === "SingleComponent" ? (
        <div
          className={`flex flex-row hover:opacity-75 ${
            component.isFocused && "prism-component-text-color"
          } hover:cursor-pointer items-center`}
          onClick={onFocusComponent}
        >
          <BoxOutline isFocus={component.isFocused} />
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
              {(component as GroupComponents).components.map((v) => (
                <ComponentItem componentId={v} key={v}/>
              ))}
            </div>
          )}

        </div>
      )}
    </>
  );
}

export default React.memo(ComponentItem);
