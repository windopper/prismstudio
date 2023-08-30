import React, { useEffect, useState } from "react";
import { SingleComponent, ElementState, focusComponent, GroupComponents } from "../prismSlice";
import { useDispatch, useSelector } from "react-redux";
import BoxOutline from "../svg/BoxOutline";
import { RootState } from "../../../store";
import { getChildComponentIdsFromComponent } from "../utils/prismSliceUtil";

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

  const childComponentFocused = useSelector((state: RootState) => {
    const { groupComponentIds, singleComponentIds } = getChildComponentIdsFromComponent(component, state.prismSlice.components);
    for (let componentId of singleComponentIds) {
      if (state.prismSlice.components.byId[componentId].isFocused) return true;
    }
    return false;
  })
  
  /* 해당 컴포넌트의 하위 컴포넌트 focus시에 그룹 콜렉션 열기 구현 필요 */
  useEffect(() => {
    if ((component.isFocused || childComponentFocused) && !isCollectionOpen) setCollectionOpen(true);
    else if (isCollectionOpen) setCollectionOpen(false);
  }, [component.isFocused, childComponentFocused])

  const onFocusComponent = () => {
    dispatch(focusComponent({ componentId: componentId }));
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
            onClick={onFocusComponent}
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
