import { forwardRef } from "react";

interface PanelInputProps {
  updateState: () => void;
  onBlur?: () => void;
}

const PanelInput = forwardRef(
  ({ updateState, onBlur }: PanelInputProps, ref: any) => {
    return (
      <div className="relative w-1/3 flex justify-center bg-transparent rounded-md m-2">
        <input
          type="text"
          className="peer relative w-full
      outline-none text-center h-6 text-white rounded-lg
      bg-black shadow-xl
      "
          ref={ref}
          onInput={updateState}
          onBlur={onBlur ?? (() => {})}
        />
        <span
          className="border-b-2 border-b-pink-500 
        absolute w-full h-2 
        bottom-0
        scale-x-0 peer-focus:scale-x-90
        transition-transform"
        ></span>
      </div>
    );
  }
);

export default PanelInput;
