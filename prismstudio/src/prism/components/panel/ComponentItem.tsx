import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { focusComponent, GroupComponents } from "../../redux/prismSlice";
import { useDispatch, useSelector } from "react-redux";
import BoxOutline from "../../svg/BoxOutline";
import { RootState } from "../../../store";
import { iterateChildComponents } from "../../utils/componentUtil";

export interface ComponentItemProp {
  componentId: string;
}

function ComponentItem({ componentId }: ComponentItemProp) {
  const dispatch = useDispatch();

  const component = useSelector((state: RootState) => {
    return state.prismSlice.components.byId[componentId];
  });

  const isFocused = useSelector((state: RootState) => {
    return state.prismSlice.components.byId[componentId]?.isFocused;
  });

  const isChildComponentFocus = useSelector((state: RootState) => {
    let focusCount = 0;
    iterateChildComponents(state.prismSlice, [componentId], (component) => {
      component.isFocused && focusCount++;
    });
    return focusCount !== 0;
  });

  const isGroupComponent = useMemo(
    () => component?.type === "GroupComponents",
    [component?.type]
  );

  const onFocusComponent = () => {
    dispatch(focusComponent({ componentId: componentId }));
  };

  if (component === undefined) return null;

  return (
    <>
      {!isGroupComponent ? (
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
              isChildComponentFocus && "text-green-500"
            }`}
            onClick={onFocusComponent}
          >
            {component.name}
          </div>
          <div
            className={`ml-2 flex flex-col gap-2 ${
              !isChildComponentFocus && "hidden"
            }`}
          >
            {(component as GroupComponents).components.map((v) => (
              <ComponentItem componentId={v} key={v} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default memo(ComponentItem);
