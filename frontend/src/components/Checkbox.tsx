import React, { Dispatch, SetStateAction } from "react";
import classnames from "classnames";

import "./Checkbox.css";

interface CheckboxProps {
  name: string;
  label: string;
  setter: Dispatch<SetStateAction<boolean>>;
  customClassName?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  name,
  label,
  setter,
  customClassName
}) => (
  <div className={classnames("checkbox", customClassName)}>
    <label htmlFor={name}>
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

export default Checkbox;
