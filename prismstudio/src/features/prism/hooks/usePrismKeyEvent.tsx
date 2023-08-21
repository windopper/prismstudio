import React, { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { outFocusComponent, setTransformControlsMode } from "../prismSlice";

export default function usePrismKeyEvent() {
  const dispatch = useDispatch();

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const key: string = e.key;
      if (key == "Escape") dispatch(outFocusComponent());
      else if(key === "r") dispatch(setTransformControlsMode({mode: 'rotate'}))
      else if(key === "t") dispatch(setTransformControlsMode({mode: 'translate'}))
      else if(key === "s") dispatch(setTransformControlsMode({mode: 'scale'}))
    },
    [dispatch]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);
}
