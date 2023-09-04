import React from "react";

export default function PanelItemContainer({ props, children }: any) {
  return (
    <div
      className="w-full bg-[#202020] rounded-xl items-center flex 
      flex-col text-sm border-gray-800 border-2 shadow-sm shadow-black"
    >
      {children}
    </div>
  );
}
