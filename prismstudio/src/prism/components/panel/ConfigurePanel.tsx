import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  COMPONENT_TOP_POINTER,
  ElementState,
  addNewComponent,
  attachGroupComponents,
  deleteFocusedComponent,
  detachGroupComponents,
} from "../../redux/prismSlice";
import DropDown from "../../../utils/DropDown";
import GroupItem from "./GroupItem";
import StatusItem from "./StatusItem";
import ComponentItem from "./ComponentItem";
import PanelItemContainer from "./PanelItemContainer";

export default function ConfigurePanel() {
  const dispatch = useDispatch();

  // const { elementStates, focusOn, components } = useSelector(
  //   (state: RootState) => {
  //     return state.prismSlice;
  //   }
  // );

  //const { allIds } = components;

  const topComponents = useSelector((state: RootState) => {
    return state.prismSlice.components.allIds
      .map((v) => state.prismSlice.components.byId[v])
      .filter((v) => v.topPointer === COMPONENT_TOP_POINTER);
  })

  console.log('panel update');

  //const focusedComponent = components.find((v) => v.id === focusOn);
  // const topComponents = Object.values(components.byId).filter(v => v.topPointer === COMPONENT_TOP_POINTER);

  const onClickCreateComponent = () => {
    dispatch(addNewComponent());
  };

  const onClickDeleteComponent = () => {
    dispatch(deleteFocusedComponent());
  };

  const onClickAttachGroup = () => {
    dispatch(attachGroupComponents());
  };

  const onClickDetachGroup = () => {
    dispatch(detachGroupComponents());
  };

  return (
    <div
      className="absolute top-0.5 right-0.5 flex flex-col w-[300px] z-10 
      m-2 rounded-lg items-center text-sm gap-2 max-h-[98%] overflow-y-scroll overflow-x-hidden"
    >
      <PanelItemContainer>
        <div className="flex flex-row flex-wrap w-full text-sm justify-center">
          <button
            className="bg-black rounded-lg text-gray-200 m-1 p-1 hover:bg-white/25"
            onClick={onClickCreateComponent}
          >
            create
          </button>
          <button
            className="bg-black rounded-lg text-gray-200 m-1 p-1 hover:bg-white/25"
            onClick={onClickDeleteComponent}
          >
            delete
          </button>
          <button
            className="bg-black rounded-lg text-gray-200 m-1 p-1 hover:bg-white/25"
            onClick={onClickAttachGroup}
          >
            group
          </button>
          <button
            className="bg-black rounded-lg text-gray-200 m-1 p-1 hover:bg-white/25"
            onClick={onClickDetachGroup}
          >
            detach
          </button>
        </div>
      </PanelItemContainer>
      <PanelItemContainer>
        <DropDown dropDownName="컴포넌트" defaultOpenState={true}>
          {topComponents.map((v) => {
            return (
              <ComponentItem
                componentId={v.id}
                key={v.id}
              />
            );
          })}
        </DropDown>
      </PanelItemContainer>
      {/* <PanelItemContainer>
        {focusOn && focusedComponent && (
          <DropDown dropDownName="그룹" defaultOpenState={true}>
            {focusedComponent.elementIds.map((v, i) => {
              const state = elementStates.find(
                (elementState) => elementState.id === v
              );
              if (state === undefined) return null;
              return (
                <GroupItem
                  elementState={state}
                  isFocused={true}
                  key={state.id}
                />
              );
            })}
          </DropDown>
        )}
      </PanelItemContainer>
      <PanelItemContainer>
        {focusOn && focusedComponent && (
          <DropDown dropDownName="상태" defaultOpenState={true}>
            <StatusItem focusedComponent={focusedComponent} />
          </DropDown>
        )}
      </PanelItemContainer> */}
    </div>
  );
}
