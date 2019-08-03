import classnames from "classnames";
import React from "react";

import "./Input.css";

interface IInputProps {
  title: string,
  value: string | number | undefined,
  setter: (...args: any[]) => void;
  customClassname?: string;
  isInline?: boolean;
}

const Input: React.FC<IInputProps> = ({
  title,
  value,
  setter,
  customClassname,
  isInline,
}) => (
  <div className={classnames("field-container", customClassname, {
    "field-container--inline": isInline,
  })}>

    {(title) ? <label className="input-label" htmlFor="imgName">{title}</label> : null}

    <input
      className="input-box"
      id="imgName"
      value={value}
      type="text"
      onChange={(e) => setter(e.target.value)}
    />

  </div>
);

export default Input;
