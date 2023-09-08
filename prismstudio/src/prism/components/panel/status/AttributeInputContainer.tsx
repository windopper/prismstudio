import WarningSVG from "prism/svg/WarningSVG";
import React from "react";

interface Props {
  isValueInValid: boolean;
  flexCol?: boolean;
  children: any;
}

const AttributeInputContainer = ({
  isValueInValid,
  flexCol = false,
  children,
}: Props) => {
  return (
    <div
      className={`relative flex ${
        flexCol ? "flex-col" : "flex-row"
      } border-2 w-full ${
        isValueInValid ? "border-red-500" : "border-transparent"
      } `}
    >
      {children}

      {isValueInValid && (
        <div
          className="absolute top-0 left-0 rounded-full p-1
     hover:bg-white/25 hover:cursor-help transition-all"
        >
          <WarningSVG />
        </div>
      )}
    </div>
  );
};

export default AttributeInputContainer;
