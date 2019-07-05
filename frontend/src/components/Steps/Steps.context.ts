import { createContext } from "react";
import { IStepsConfig } from "./Steps";

export const StepsContext = createContext<{
    steps: IStepsConfig,
    setSteps: any
}>({
    steps: {},
    setSteps: () => {}
});
