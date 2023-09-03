import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useMemo } from "react";
import { getChildElementIdsFromComponents } from "../utils/componentUtil";

/**
 * 
 * @returns 선택된 컴포넌트의 elementState id 들을 반환 
 */
const useFocusedChildrenElementIds = (): string[][] => {
  const { components, focusOn } = useSelector(
    (state: RootState) => state.prismSlice
  );
  const focusedComponents = focusOn.map((v) => components.byId[v]);

  const childrenElementIds: string[][] = useMemo(
    () =>
      focusedComponents.map((v) =>
        getChildElementIdsFromComponents([v], components)
      ),
    [focusedComponents, components]
  );

  return childrenElementIds;
};

export default useFocusedChildrenElementIds
