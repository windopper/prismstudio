import { memo, useCallback, useEffect, useState } from "react";
import { focusComponent, GroupComponents } from "../../redux/prismSlice";
import { useDispatch, useSelector } from "react-redux";
import BoxOutline from "../../svg/BoxOutline";
import { RootState } from "../../../store";

export interface ComponentItemProp {
  componentId: string,
  setTopCollectionOpen?: (v: boolean) => void;
}

function ComponentItem({
  componentId,
  setTopCollectionOpen
}: ComponentItemProp) {
  const [isCollectionOpen, setCollectionOpen] = useState(false);
  console.log(componentId + ' update' + isCollectionOpen)

  const dispatch = useDispatch();
  
  const component = useSelector((state: RootState) => {
    return state.prismSlice.components.byId[componentId];
  })

  const { isFocused } = useSelector((state: RootState) => {
    return state.prismSlice.components.byId[componentId];
  })

  const setTopAndCurrentCollectionOpen = useCallback((v: boolean) => {
    component.type === "GroupComponents" && setCollectionOpen(v);
    setTopCollectionOpen && setTopCollectionOpen(v);
  }, [setTopCollectionOpen, setCollectionOpen, component.type]);
  
  /* 해당 컴포넌트가 포커스되거나 하위 컴포넌트에 의해 열렸을 때 버블링 */
  useEffect(() => {
    console.log(componentId + ' focus changed to ' + isFocused)
    if (isFocused) setTopAndCurrentCollectionOpen(true);
    else setTopAndCurrentCollectionOpen(false);
  }, [isFocused, setTopAndCurrentCollectionOpen])

  const onFocusComponent = () => {
    dispatch(focusComponent({ componentId: componentId }));
  };
  
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
            onClick={onFocusComponent}
          >
            {component.name}
          </div>
          <div
            className={`ml-2 flex flex-col gap-2 ${
              !isCollectionOpen && "hidden"
            }`}
          >
            {(component as GroupComponents).components.map((v) => (
              <ComponentItem
                componentId={v}
                setTopCollectionOpen={setTopAndCurrentCollectionOpen}
                key={v}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default memo(ComponentItem);
