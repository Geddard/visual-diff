import React, { Dispatch } from "react";

type TStringSetter = Dispatch<React.SetStateAction<string>>;

interface InputProps {
  title: string,
  value: string,
  setter: TStringSetter
}

const Input: React.FC<InputProps> = ({
  title,
  value,
  setter
}) => (
  <div className="field-container">
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
