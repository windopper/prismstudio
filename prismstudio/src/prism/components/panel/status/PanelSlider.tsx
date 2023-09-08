import { forwardRef } from "react";

interface PanelSlideProps {
  updateState: () => void;
}

const PanelSlider = forwardRef(({ updateState }: PanelSlideProps, ref: any) => {
  return (
    <input
      type="range"
      min="-3.14"
      max="3.14"
      step={0.01}
      className="slider flex-initial w-4/5"
      onChange={updateState}
      ref={ref}
    />
  );
});

export default PanelSlider;
