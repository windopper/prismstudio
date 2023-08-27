import React, { useState } from "react";

export interface DropDownProps {
  dropDownName: string;
  defaultOpenState: boolean;
  children: any;
}

export default function DropDown({
  dropDownName,
  defaultOpenState,
  children,
}: DropDownProps) {
  const [isOpen, setOpenState] = useState(true);

  const toggleOpenState = () => {
    setOpenState((state) => !state);
  };

  return (
    <div className="flex flex-col p-2 m-1 w-full items-center">
      <div
        className="w-full m-1 hover:opacity-75 hover:cursor-pointer rounded-sm p-1"
        onClick={toggleOpenState}
      >
        {dropDownName}
      </div>
      <div className={`w-full px-2 flex flex-col gap-2 ${!isOpen && "hidden"}`}>
        {children}
      </div>
    </div>
  );
}
