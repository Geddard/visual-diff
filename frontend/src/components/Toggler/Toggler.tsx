import React, { useState } from "react";
import classnames from "classnames";

import "./Toggler.css";

type TToggleHandler = (option: string) => void;
type TOptions ={
  [key: string]: string
};

interface TogglerProps {
  options: TOptions;
  defaultOption?: string;
  handler: TToggleHandler;
  children?: JSX.Element
}

const Toggler: React.FC<TogglerProps> = ({
  options,
  defaultOption = "",
  handler,
  children
}) => {
  const [activeOption, setActiveOption] = useState(defaultOption);

  const renderOptions = (options: TOptions, handler: TToggleHandler) => {
    return Object.values(options).map((option: string, index: number) => {
      return (
        <button
          key={index}
          onClick={() => handleTogglerClick(handler, option)}
          className={getClassNames(option)}
        >
          {option}
        </button>
      );
    });
  };

  const handleTogglerClick = (handler: TToggleHandler, option: string) => {
    setActiveOption(option);
    handler(option);
  };

  const getClassNames = (option: string) => {
    return classnames("toggler__option", {
      "toggler__option--active": option === activeOption
    })
  }

  return (
    <div className="toggler__wrapper">
      <div className="toggler">
        {(renderOptions(options, handler))}
      </div>
      <div className="toggler__children">
        {children}
      </div>
    </div>
  );
}

export default Toggler;
