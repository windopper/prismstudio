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
    <>
      {!isOpen ? (
        <DropDownContainer>
          <div
            className="w-full p-1 hover:opacity-75 hover:cursor-pointer 
          rounded-sm text-2xl flex flex-row border-b-2 
          border-zinc-700/50"
            onClick={toggleOpenState}
          >
            <div>{dropDownName}</div>
          </div>
        </DropDownContainer>
      ) : (
        <>
          {React.Children.toArray(children).length !== 0 && (
            <DropDownContainer>
              <div
                className={`w-full flex flex-col gap-1 ${!isOpen && "hidden"}`}
              >
                {children}
              </div>
            </DropDownContainer>
          )}
        </>
      )}
    </>
  );
}

const DropDownContainer = ({ children }: any) => {
  return (
    <div
      className={`flex flex-col w-full items-center text-[${dropDownNameColor}] py-1`}
    >
      {children}
    </div>
  );
};
