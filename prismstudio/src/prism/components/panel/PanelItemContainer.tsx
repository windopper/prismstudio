import React from "react";

export default function PanelItemContainer({ props, children }: any) {
  return (
    <div className="w-full bg-black rounded-lg items-center flex flex-col text-sm">
      {children}
    </div>
  );
}
