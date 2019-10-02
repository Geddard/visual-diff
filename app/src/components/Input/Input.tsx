import classnames from "classnames";
import uniqueId from "lodash-es/uniqueId";
import React from "react";

import "./Input.css";

interface IInputProps {
  id?: string;
  title: string | undefined;
  value: string | number | undefined;
  setter: (...args: any[]) => void;
  customClassname?: string;
  isInline?: boolean;
}

const Input: React.FC<IInputProps> = ({ id, title, value, setter, customClassname, isInline }) => (
  <div
    className={classnames("field-container", customClassname, {
      "field-container--inline": isInline
    })}
  >
    {title ? <label className="input-label">{title}</label> : null}

    <input
      id={id || uniqueId(title)}
      className="input-box"
      value={value}
      type="text"
      onChange={e => setter(e.target.value)}
    />
  </div>
);

export default Input;
