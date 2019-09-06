export enum EXTRA_PARAMS {
    CROP = "CROP",
    TYPE = "TYPE",
    REPLACE = "REPLACE",
}

interface IConfigOption {
    actionKey: string;
    actionText: string;
    inputText?: string;
    extraParam?: keyof typeof EXTRA_PARAMS;
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
        extraParam: EXTRA_PARAMS.TYPE,
        inputText: "Element",
    },
    {
        actionKey: "FOCUS",
        actionText: "Focus",
        inputText: "Element",
    },
    {
        actionKey: "HOVER",
        actionText: "Hover",
        inputText: "Element",
    },
    {
        actionKey: "NAVIGATE",
        actionText: "Navigate",
        inputText: "URL",
    },
    {
        actionKey: "SCREENSHOT",
        actionText: "Screenshot",
        extraParam: EXTRA_PARAMS.CROP,
        inputText: "Element",
    },
    {
        actionKey: "WAIT",
        actionText: "Wait",
        inputText: "Time",
    },
    {
        actionKey: "REPLACE",
        actionText: "Replace Content",
        extraParam: EXTRA_PARAMS.REPLACE,
        inputText: "Element",
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

export const getInputText = (actionKey: string) => {
    const option = getOptionByKey(actionKey);

    return option && option.inputText;
};

export const hasExtraParam = (actionKey: string) => {
    const option = getOptionByKey(actionKey);

    return !!(option && option.extraParam);
};
