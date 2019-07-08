import React, { useState, useContext } from "react";
import cloneDeep from "lodash-es/cloneDeep";
import set from "lodash-es/set";
import isEmpty from "lodash-es/isEmpty";

import "./Steps.css";

import Select from "../Select/Select";
import Input from "../Input/Input";
import { StepsContext } from "./Steps.context";

enum OPTIONS {
  HOVER = "Hover",
  CLICK = "Click",
  NAVIGATE = "Navigate",
  WAIT = "Wait",
  FOCUS = "Focus",
  SCREENSHOT = "Screenshot"
}

enum ACTION_PAIRS {
  HOVER = "Element (JS Path)",
  CLICK = "Element (JS Path)",
  NAVIGATE = "URL",
  WAIT = "Time",
  FOCUS = "Element (JS Path)",
  SCREENSHOT = ""
}

export interface IStepsConfig {
  [key: number]: {
    action: string;
    value: string | number;
  }
}

const Steps: React.FC = () => {
  const [steps, setSteps] = useState(0);
  const [stepsConfig, setStepsConfig] = useState<IStepsConfig>({});

  const context = useContext(StepsContext);

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

      if (!isEmpty(ACTION_PAIRS[action])) {
        return <Input
                  title={ACTION_PAIRS[action]}
                  value={stepsConfig[index].value}
                  setter={changeStepTarget.bind(null, index)}
                  isInline
                />;
      }
    }
  }

  const changeStepAction = (index: number, action: string) => {
    const newConfig = cloneDeep(stepsConfig);

    set(newConfig, `${index}`, { action: action.toUpperCase(), value: "" });
    setStepsConfig(newConfig);
    updateStepsContext(newConfig);
  }

  const changeStepTarget = (index: number, target: string) => {
    const newConfig = cloneDeep(stepsConfig);

    newConfig[index].value = target;
    setStepsConfig(newConfig);
    updateStepsContext(newConfig);
  }

  const updateStepsContext = (stepsConfig: IStepsConfig) => {
    context.setSteps(stepsConfig);
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
