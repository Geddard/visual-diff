import React from "react";

interface IOptionWithValue {
  text: string;
  value: string;
}
interface ISelectProps {
  className?: string;
  options?: string[];
  optionsWithValue?: IOptionWithValue[];
  defaultOption?: string | IOptionWithValue;
  onChangeHandler: (...args: any[]) => void;
}

const Select: React.FC<ISelectProps> = ({ className, options, optionsWithValue, defaultOption, onChangeHandler }) => {
  const renderOptions = () => {
    let optionsToRender: JSX.Element[] = [];

    if (options) {
      optionsToRender = [(defaultOption as string) || "Select"]
        .concat(options)
        .map((option: string, index: number) => <option key={index}>{option}</option>);
    } else if (optionsWithValue) {
      optionsToRender = [(defaultOption as IOptionWithValue) || { text: "Select", value: "" }]
        .concat(optionsWithValue)
        .map((option: IOptionWithValue, index: number) => {
          return (
            <option key={index} value={option.value}>
              {option.text}
            </option>
          );
        });
    }

    return optionsToRender;
  };

  return (
    <select className={className} onChange={event => onChangeHandler(event.target.value)}>
      {renderOptions()}
    </select>
  );
};

export default Select;
