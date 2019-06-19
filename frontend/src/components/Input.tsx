import React, { Dispatch } from "react";
import classnames from "classnames";

import "./Input.css";

interface InputProps {
  title: string,
  value: string,
  setter: Dispatch<React.SetStateAction<string>>;
  customClassname?: string
}

const Input: React.FC<InputProps> = ({
  title,
  value,
  setter,
  customClassname
}) => (
  <div className={classnames("field-container", customClassname)}>
    <label className="input-label" htmlFor="imgName">{title}</label>
    <input
      className="input-box"
      id="imgName"
      value={value}
      type="text"
      onChange={e => setter(e.target.value)}
    />
  </div>
);

export default Input;
