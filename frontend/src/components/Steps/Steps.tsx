import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import set from "lodash-es/set";
import uniqueId from "lodash-es/uniqueId";
import React, { useContext, useState } from "react";
import { EXTRA_PARAMS, getInputText, getOptionByKey, hasExtraParam, options } from "./Steps.config";

import Checkbox from "../Checkbox/Checkbox";
import Input from "../Input/Input";
import Select from "../Select/Select";

import { StepsContext } from "./Steps.context";
import "./Steps.css";

export interface IStep {
  action: string;
  value: string | number;
  id: string;
  crop?: boolean;
  cropTarget?: string;
  textTarget?: string;
  replaceTarget?: string;
}

const Steps: React.FC = () => {
  const [stepsConfig, setStepsConfig] = useState<IStep[]>([]);

  const context = useContext(StepsContext);
  const defaultStepsOption = {
    text: "Select Action",
    value: "",
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

  const renderInput = (title: string | undefined, value: keyof IStep, index: number, isInline: boolean = false) => {
    const inputProps = {
      isInline,
      setter: changeHandler.bind(null, index, value),
      title,
      value: stepsConfig[index][value] as string,
    };

    return (
      <Input {...inputProps} />
    );
  };

  const renderExtraParam = (actionKey: string, index: number, actionPair: string | undefined) => {
    const actionConfig = getOptionByKey(actionKey);
    let extraParam;
    let extraParamAdditional;

    if (!!actionConfig) {
      if (actionConfig.extraParam === EXTRA_PARAMS.CROP) {
        extraParam = (
          <Checkbox
            name="cropToElement"
            setter={changeHandler.bind(null, index, "crop")}
            label="Crop to element"
            customClassName="step__crop"
          />
        );
        extraParamAdditional = stepsConfig[index].crop ? renderInput("Element", "cropTarget", index, true) : null;
      } else if (actionConfig.extraParam === EXTRA_PARAMS.TYPE) {
        extraParam = renderInput(actionPair, "textTarget", index, true);
        extraParamAdditional = renderInput("Text", "value", index, true);
      } else if (actionConfig.extraParam === EXTRA_PARAMS.REPLACE) {
        extraParam = renderInput(actionPair, "replaceTarget", index, true);
        extraParamAdditional = renderInput("Text", "value", index, true);
      }
    }

    return (
      <span className="step__params">
        {extraParam}
        {extraParamAdditional}
      </span>
    );
  };

  const renderRegularcontent = (index: number, actionPair: string | undefined) => {
    return (
      <Input
        title={actionPair}
        value={stepsConfig[index].value}
        setter={changeHandler.bind(null, index, "value")}
        isInline
      />
    );
  };

  const renderStepAdditionals = (index: number) => {
    if (!isEmpty(stepsConfig[index])) {
      const action = (stepsConfig[index].action);

      if (!!action) {
        const actionPair = getInputText(action);

        return hasExtraParam(action)
          ? renderExtraParam(action, index, actionPair)
          : renderRegularcontent(index, actionPair);
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
