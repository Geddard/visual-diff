import React from "react";
import classnames from "classnames";

import "./Input.css";

interface InputProps {
  title: string,
  value: string | number | undefined,
  setter: (...args: any[]) => void;
  customClassname?: string
  isInline?: boolean;
}

const Input: React.FC<InputProps> = ({
  title,
  value,
  setter,
  customClassname,
  isInline
}) => (
  <div className={classnames("field-container", customClassname, {
    "field-container--inline": isInline
  })}>
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
