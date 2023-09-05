import React from "react";

interface Props {
  bgColor?: string,
  children: any
}

export default function PanelItemContainer({ bgColor="rgb(42, 42, 42)", children }: Props) {
  return (
    <div
      className={`w-full rounded-xl items-center flex 
      flex-col text-sm shadow-sm`}
      style={{backgroundColor: bgColor}}
    >
      {children}
    </div>
  );
}
