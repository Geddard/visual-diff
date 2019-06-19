import React from "react";

interface SelectProps {
  className: string;
  options: string[];
  onChangeHandler: (selectedImage: string) => void
}

const Select: React.FC<SelectProps> = ({
  className,
  options,
  onChangeHandler
}) => (
  <select
    className={className}
    onChange={(event) => onChangeHandler(event.target.value)}
  >
    {renderOptions(options)}
  </select>
);

const renderOptions = (options: string[]) => {
  const selectOptions = [
    "Select Image"
  ];

  if (options) {
    return selectOptions.concat(options).map((option: string, index: number) => <option key={index}>{option}</option>)
  }
}
export default Select;
