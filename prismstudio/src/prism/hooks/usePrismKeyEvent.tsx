import React, { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { outFocusComponent, setGroupSelectionMode, setTransformControlsMode } from "../redux/prismSlice";

export default function usePrismKeyEvent() {
  const dispatch = useDispatch();

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.repeat) return;
      const key: string = e.key;
      if (key === "Escape") dispatch(outFocusComponent({}));
      else if(key === 'Shift') dispatch(setGroupSelectionMode({enabled: true}))
      else if(key === "r") dispatch(setTransformControlsMode({mode: 'rotate'}))
      else if(key === "t") dispatch(setTransformControlsMode({mode: 'translate'}))
      else if(key === "s") dispatch(setTransformControlsMode({mode: 'scale'}))
    },
    [dispatch]
  );

  const onKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.repeat) return;
      const key: string = e.key;
      if(key === 'Shift') dispatch(setGroupSelectionMode({enabled: false}))
    },
    [dispatch]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp)
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);
}
