import { forwardRef } from "react";

interface PanelInputProps {
  updateState: () => void;
}

const PanelInput = forwardRef(({ updateState }: PanelInputProps, ref: any) => {
  return (
    <div className="relative w-1/3 flex justify-center bg-transparent rounded-md m-2">
      <input
        type="text"
        className="peer relative w-full bg-transparent 
      outline-none text-center h-6
      "
        ref={ref}
        onInput={updateState}
      />
      <span
        className="border-b-2 border-b-pink-500 absolute w-full h-2 
      top-[90%] 
      scale-x-0 peer-focus:scale-x-100 
      transition-transform"
      ></span>
    </div>
  );
});

export default PanelInput;
