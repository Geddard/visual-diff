import React from "react";

interface SelectProps {
  className?: string;
  options: string[];
  defaultOption?: string;
  onChangeHandler: (...args: any[]) => void
}

const Select: React.FC<SelectProps> = ({
  className,
  options,
  defaultOption,
  onChangeHandler
}) => {

  const renderOptions = () => {
    const selectOptions = [
      defaultOption || "Select"
    ];

    if (options) {
      return selectOptions.concat(options).map((option: string, index: number) => <option key={index}>{option}</option>)
    }
  }

  return (
    <select
      className={className}
      onChange={(event) => onChangeHandler(event.target.value)}
    >
      {renderOptions()}
    </select>
  );
}


export default Select;
