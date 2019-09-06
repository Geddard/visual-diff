import { createContext } from "react";
import { IStep } from "./Steps.config";

export const StepsContext = createContext<{
    steps: IStep[],
    setSteps: any,
}>({
    setSteps: () => null,
    steps: [],
});
