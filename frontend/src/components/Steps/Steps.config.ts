export type TFieldTypes = "input" | "checkbox";

export interface IStep {
  action: string;
  value: string | number;
  id: string;
  crop?: boolean;
  cropTarget?: string;
  hideTargets?: string;
  textTarget?: string;
  replaceTarget?: string;
  replaceTargetAll?: string;
}

export interface IStepField {
  customClassName?: string;
  type: TFieldTypes;
  setterValue: keyof IStep;
  title?: string;
  isInline?: boolean;
}

export interface IConfigOption {
  actionKey: string;
  actionText: string;
  inputText?: string;
  fields?: IStepField[];
}

export const config: IConfigOption[] = [{
    actionKey: "CLICK",
    actionText: "Click",
    fields: [{
      isInline: true,
      setterValue: "value",
      title: "Element",
      type: "input",
    }],
  },
  {
    actionKey: "ENTER_TEXT",
    actionText: "Enter Text",
    fields: [{
        isInline: true,
        setterValue: "textTarget",
        title: "Element",
        type: "input",
      },
      {
        isInline: true,
        setterValue: "value",
        title: "Text",
        type: "input",
      },
    ],
  },
  {
    actionKey: "FOCUS",
    actionText: "Focus",
    fields: [{
      isInline: true,
      setterValue: "value",
      title: "Element",
      type: "input",
    }],
  },
  {
    actionKey: "HOVER",
    actionText: "Hover",
    fields: [{
      isInline: true,
      setterValue: "value",
      title: "Element",
      type: "input",
    }],
  },
  {
    actionKey: "NAVIGATE",
    actionText: "Navigate",
    fields: [{
      isInline: true,
      setterValue: "value",
      title: "URL",
      type: "input",
    }],
  },
  {
    actionKey: "SCREENSHOT",
    actionText: "Screenshot",
    fields: [{
        customClassName: "step__crop",
        isInline: true,
        setterValue: "crop",
        title: "Crop to element",
        type: "checkbox",
      },
      {
        isInline: true,
        setterValue: "cropTarget",
        title: "Element",
        type: "input",
      },
    ],
  },
  {
    actionKey: "WAIT",
    actionText: "Wait",
    fields: [{
      isInline: true,
      setterValue: "value",
      title: "Time/Selector",
      type: "input",
    }],
  },
  {
    actionKey: "REPLACE",
    actionText: "Replace Content",
    fields: [{
        isInline: true,
        setterValue: "replaceTarget",
        title: "Element",
        type: "input",
      },
      {
        isInline: true,
        setterValue: "value",
        title: "Text",
        type: "input",
      },
    ],
  },
  {
    actionKey: "REPLACE_ALL",
    actionText: "Replace Content (all matches)",
    fields: [{
        isInline: true,
        setterValue: "replaceTargetAll",
        title: "Element",
        type: "input",
      },
      {
        isInline: true,
        setterValue: "value",
        title: "Text",
        type: "input",
      },
    ],
  },
  {
    actionKey: "HIDE",
    actionText: "Hide Elements",
    fields: [{
        isInline: true,
        setterValue: "hideTargets",
        title: "Elements",
        type: "input",
      },
    ],
  },
];

export const options = config.map((option: IConfigOption) => {
  return {
    text: option.actionText,
    value: option.actionKey,
  };
});

export const getOptionByKey = (actionKey: string) => {
  return config.find((configOption: IConfigOption) => configOption.actionKey === actionKey);
};

export const hasFields = (actionKey: string) => {
  const option = getOptionByKey(actionKey);

  return !!(option && option.fields && option.fields.length);
};
