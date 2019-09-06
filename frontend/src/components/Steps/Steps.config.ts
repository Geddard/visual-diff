export interface IStep {
    action: string;
    value: string | number;
    id: string;
    crop?: boolean;
    cropTarget?: string;
    textTarget?: string;
    replaceTarget?: string;
}

export type TFieldTypes = "Input" | "Checkbox";

export interface IStepField {
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

export const config: IConfigOption[] = [
    {
        actionKey: "CLICK",
        actionText: "Click",
        inputText: "Element",
    },
    {
        actionKey: "ENTER_TEXT",
        actionText: "Enter Text",
        fields: [
            {
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
    },
    {
        actionKey: "HOVER",
        actionText: "Hover",
    },
    {
        actionKey: "NAVIGATE",
        actionText: "Navigate",
    },
    {
        actionKey: "SCREENSHOT",
        actionText: "Screenshot",
    },
    {
        actionKey: "WAIT",
        actionText: "Wait",
    },
    {
        actionKey: "REPLACE",
        actionText: "Replace Content",
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
