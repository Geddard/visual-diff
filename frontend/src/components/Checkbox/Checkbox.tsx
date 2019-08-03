import classnames from "classnames";
import React, { Dispatch, SetStateAction } from "react";

import "./Checkbox.css";

type TSetter = Dispatch<SetStateAction<boolean>>;

interface ICheckboxProps {
  name: string;
  label: string;
  setter: (...args: any[]) => void | TSetter;
  customClassName?: string;
}

const Checkbox: React.FC<ICheckboxProps> = ({
  name,
  label,
  setter,
  customClassName,
}) => {

  return (
    <div className={classnames("checkbox", customClassName)}>
      <label htmlFor={name} className="checkbox__label">
        {label}
      </label>
      <input
        type="checkbox"
        name={name}
        id={name}
        onChange={(e) => setter(e.target.checked)}
      />
    </div>
  );
};

export default Checkbox;
