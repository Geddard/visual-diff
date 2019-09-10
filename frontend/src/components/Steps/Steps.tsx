import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import set from "lodash-es/set";
import uniqueId from "lodash-es/uniqueId";
import React, { useContext, useState } from "react";
import {
  getOptionByKey,
  hasFields,
  IStep,
  IStepField,
  options,
} from "./Steps.config";

import Checkbox from "../Checkbox/Checkbox";
import Input from "../Input/Input";
import Select from "../Select/Select";

import { StepsContext } from "./Steps.context";
import "./Steps.css";

const Steps: React.FC = () => {
  const [stepsConfig, setStepsConfig] = useState<IStep[]>([]);

  const context = useContext(StepsContext);
  const defaultStepsOption = {
    text: "Select Action",
    value: "",
  };

  const tagTypes = {
    checkbox: Checkbox,
    input: Input,
  };

  const renderStep = (step: IStep, stepIndex: number) => {
    return (
      <div className="step__container" key={step.id}>

        <button className="steps__remove" onClick={() => removeStep(stepIndex)}>X</button>

        <Select
          defaultOption={defaultStepsOption}
          className="steps__select-action"
          optionsWithValue={options}
          onChangeHandler={changeHandler.bind(null, stepIndex, "action")}
        />

        {renderStepAdditionals(stepIndex)}
      </div>
    );
  };

  const addStep = () => {
    const newStepsConfig = cloneDeep(stepsConfig);

    newStepsConfig.push({
      action: "",
      crop: false ,
      cropTarget: "",
      id: `${newStepsConfig.length + 1}_${uniqueId()}`,
      replaceTarget: "",
      textTarget: "",
      value: "",
    });

    setStepsConfig(newStepsConfig);
    context.setSteps(newStepsConfig);
  };

  const removeStep = (index: number) => {
    const newStepsConfig = cloneDeep(stepsConfig);
    newStepsConfig.splice(index, 1);

    setStepsConfig(newStepsConfig);
    context.setSteps(newStepsConfig);
  };

  const renderActionField = (stepIndex: number, actionField: IStepField, fieldIndex: number) => {
    const fieldProps = {
      customClassName: actionField.customClassName,
      isInline: actionField.isInline,
      key: fieldIndex,
      label: actionField.title,
      name: actionField.setterValue,
      setter: changeHandler.bind(null, stepIndex, actionField.setterValue),
      title: actionField.title,
      value: stepsConfig[stepIndex][actionField.setterValue] as string,
    };

    const Component = tagTypes[actionField.type];

    return <Component {...fieldProps}/>;
  };

  const renderFileds = (actionKey: string, stepIndex: number) => {
    const actionConfig = getOptionByKey(actionKey);

    if (!!actionConfig && actionConfig.fields && actionConfig.fields.length) {
      return (
        <span className="step__params">
          {actionConfig.fields.map(renderActionField.bind(null, stepIndex))}
        </span>
      );
    }
  };

  const renderStepAdditionals = (index: number) => {
    if (!isEmpty(stepsConfig[index])) {
      const action = (stepsConfig[index].action);

      if (!!action) {
        return hasFields(action) && renderFileds(action, index);
      }
    }
  };

  const updateConfig = (configUpdater: (newConfig: IStep[]) => void) => {
    const newConfig = cloneDeep(stepsConfig);

    configUpdater(newConfig);

    setStepsConfig(newConfig);
    context.setSteps(newConfig);
  };

  const changeHandler = (index: number, configKey: keyof IStep, action: string) => {
    const configUpdater = (newConfig: IStep[]) => {
      set(newConfig[index], `${configKey}`, action);
    };

    updateConfig(configUpdater);
  };

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
