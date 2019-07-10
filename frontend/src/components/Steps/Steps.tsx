import React, { useState, useContext } from "react";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";

import "./Steps.css";

import Select from "../Select/Select";
import Input from "../Input/Input";
import { StepsContext } from "./Steps.context";
import uniqueId from "lodash-es/uniqueId";

enum OPTIONS {
  HOVER = "Hover",
  CLICK = "Click",
  NAVIGATE = "Navigate",
  WAIT = "Wait",
  FOCUS = "Focus",
  SCREENSHOT = "Screenshot"
}

enum ACTION_PAIRS {
  HOVER = "Element",
  CLICK = "Element",
  NAVIGATE = "URL",
  WAIT = "Time",
  FOCUS = "Element",
  SCREENSHOT = ""
}

export interface IStepsConfig {
  action: string;
  value: string | number;
  id: string;
}

const Steps: React.FC = () => {
  const [stepsConfig, setStepsConfig] = useState<IStepsConfig[]>([]);

  const context = useContext(StepsContext);

  const renderStep = (config: IStepsConfig, stepIndex: number) => {
    return (
      <div className="step__container" key={config.id}>

        <button className="steps__remove" onClick={() => removeStep(stepIndex)}>X</button>

        <Select
          defaultOption="Select Action"
          className="steps__select-action"
          options={Object.values(OPTIONS)}
          onChangeHandler={changeStepAction.bind(null, stepIndex)}
        />

        {renderStepInput(stepIndex)}
      </div>
    );
  }

  const addStep = () => {
    const newStepsConfig = cloneDeep(stepsConfig);

    newStepsConfig.push({
      action: "",
      value: "",
      id: `${newStepsConfig.length + 1}_${uniqueId()}`
    });

    setStepsConfig(newStepsConfig);
    context.setSteps(newStepsConfig);
  }

  const removeStep = (index: number) => {
    const newStepsConfig = cloneDeep(stepsConfig);
    newStepsConfig.splice(index, 1);

    setStepsConfig(newStepsConfig);
    context.setSteps(newStepsConfig);
  }

  const renderStepInput = (index: number) => {
    if (!isEmpty(stepsConfig[index])) {
      const action = (stepsConfig[index].action as keyof typeof ACTION_PAIRS);

      if (!isEmpty(ACTION_PAIRS[action])) {
        return (
          <span className="step__params">
            <Input
              title={ACTION_PAIRS[action]}
              value={stepsConfig[index].value}
              setter={changeStepTarget.bind(null, index)}
              isInline
            />
          </span>
        );
      }
    }
  }

  const updateConfig = (configUpdater: (newConfig: IStepsConfig[]) => void) => {
    const newConfig = cloneDeep(stepsConfig);

    configUpdater(newConfig);

    setStepsConfig(newConfig);
    context.setSteps(newConfig);
  }

  const changeStepAction = (index: number, action: string) => {
    const configUpdater = (newConfig: IStepsConfig[]) => {
      newConfig[index].action = action.toUpperCase();
    };

    updateConfig(configUpdater);
  }

  const changeStepTarget = (index: number, target: string) => {
    const configUpdater = (newConfig: IStepsConfig[]) => {
      newConfig[index].value = target;
    };

    updateConfig(configUpdater);
  }

  return (
    <div className="steps">
      Steps

      <button className="steps__add-btn" onClick={() => addStep()}>
          Add a step
      </button>

      {stepsConfig.map(renderStep)}
    </div>
  );
};

export default Steps;
