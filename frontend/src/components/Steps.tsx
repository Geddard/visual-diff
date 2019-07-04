import React, { useState } from "react";
import Select from "./Select";

import "./Steps.css";
import cloneDeep from "lodash-es/cloneDeep";
import set from "lodash-es/set";
import isEmpty from "lodash-es/isEmpty";
import Input from "./Input";

enum OPTIONS {
  HOVER = "Hover",
  CLICK = "Click",
  NAVIGATE = "Navigate",
  WAIT = "Wait",
  FOCUS = "Focus"
}

enum ACTION_PAIRS {
  HOVER = "Element",
  CLICK = "Element",
  NAVIGATE = "URL",
  WAIT = "Time",
  FOCUS = "Element"
}

interface IStepsConfig {
  [key: number]: {
    action: string;
    value: string | number;
  }
}

const Steps: React.FC = () => {
  const [steps, setSteps] = useState(0);
  const [stepsConfig, setStepsConfig] = useState<IStepsConfig>({});

  const renderSteps = () => {
    const stepsToRender = [];

    for (let i = 0; i < steps; i++) {
      stepsToRender.push(renderStep(i))
    }

    return stepsToRender;
  }

  const renderStep = (index: number) => {
    return (
      <div className="step__container" key={index}>
        <Select
          defaultOption="Select Action"
          className="steps__select-action"
          options={Object.values(OPTIONS)}
          onChangeHandler={changeStepAction.bind(null, index)}
        />
        {renderStepInput(index)}
      </div>
    );
  }

  const renderStepInput = (index: number) => {
    if (!isEmpty(stepsConfig[index])) {
      const action = (stepsConfig[index].action as keyof typeof ACTION_PAIRS);

      return <Input
                title={ACTION_PAIRS[action]}
                value={stepsConfig[index].value}
                setter={changeStepTarget.bind(null, index)}
                isInline
              />
    }
  }

  const changeStepAction = (index: number, action: string) => {
    const newConfig = cloneDeep(stepsConfig);

    set(newConfig, `${index}`, { action: action.toUpperCase(), value: "" });
    setStepsConfig(newConfig);
  }

  const changeStepTarget = (index: number, target: string) => {
    const newConfig = cloneDeep(stepsConfig);

    newConfig[index].value = target;
    setStepsConfig(newConfig);
  }

  return (
    <div className="steps">
      Steps

      <button className="steps__add-btn" onClick={() => setSteps(steps + 1)}>
          Add a step
      </button>

      {renderSteps()}
    </div>
  );
};

export default Steps;
