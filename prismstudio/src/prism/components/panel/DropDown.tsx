import React, { ReactNode, useState } from "react";
import ChevronRight from "../../svg/ChevronRight";
import ChevronBottom from "../../svg/ChevronBottom";

export interface DropDownProps {
  dropDownName: string;
  defaultOpenState: boolean;
  children: ReactNode;
}

const dropDownNameColor = "#b6cbda8f";

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
    <div
      className={`flex flex-col w-full items-center text-[${dropDownNameColor}]`}
    >
      {
        !isOpen ? <div
          className="w-full p-1 hover:opacity-75 hover:cursor-pointer 
          rounded-sm text-2xl flex flex-row border-b-2 
          border-zinc-700/50"
          onClick={toggleOpenState}
        >
          {/* {isOpen ? (
            <ChevronBottom fill={dropDownNameColor} />
          ) : (
            <ChevronRight fill={dropDownNameColor} />
          )} */}
          <div>{dropDownName}</div>
        </div> : <>
        {React.Children.toArray(children).length !== 0 && (
          <div
            className={`w-full px-2 py-2 flex flex-col gap-1 ${
              !isOpen && "hidden"
            }`}
          >
            {children}
          </div>
        )}
        </>
      }
    </div>
  );
}
