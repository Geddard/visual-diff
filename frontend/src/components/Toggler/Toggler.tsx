import classnames from "classnames";
import React, { useState } from "react";

import "./Toggler.css";

type TToggleHandler = (option: string) => void;
interface IOptions {
  [key: string]: string;
}

interface ITogglerProps {
  options: IOptions;
  defaultOption?: string;
  handler: TToggleHandler;
  children?: JSX.Element;
}

const Toggler: React.FC<ITogglerProps> = ({
  options,
  defaultOption = "",
  handler,
  children,
}) => {
  const [activeOption, setActiveOption] = useState(defaultOption);

  const renderOptions = (optionsToRender: IOptions) => {
    return Object.values(optionsToRender).map((option: string, index: number) => {
      return (
        <button
          key={index}
          onClick={() => handleTogglerClick(option)}
          className={getClassNames(option)}
        >
          {option}
        </button>
      );
    });
  };

  const handleTogglerClick = (option: string) => {
    setActiveOption(option);
    handler(option);
  };

  const getClassNames = (option: string) => {
    return classnames("toggler__option", {
      "toggler__option--active": option === activeOption,
    });
  };

  return (
    <div className="toggler__wrapper">
      <div className="toggler">
        {(renderOptions(options))}
      </div>
      <div className="toggler__children">
        {children}
      </div>
    </div>
  );
};

export default Toggler;
