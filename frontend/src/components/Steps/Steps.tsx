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
        extraParamAdditional = stepsConfig[index].crop
          ? (
            <Input
              title={"Element"}
              value={stepsConfig[index].cropTarget}
              setter={changeHandler.bind(null, index, "cropTarget")}
              isInline
            />
          )
          : null;
      } else if (actionConfig.extraParam === EXTRA_PARAMS.TYPE) {
        extraParam = (
          <Input
            title={actionPair}
            value={stepsConfig[index].value}
            setter={changeHandler.bind(null, index, "value")}
            isInline
          />
        );
        extraParamAdditional = (
          <Input
            title={actionPair}
            value={stepsConfig[index].textTarget}
            setter={changeHandler.bind(null, index, "textTarget")}
            isInline
          />
        );
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
        id={`${index}-${actionPair}`}
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
