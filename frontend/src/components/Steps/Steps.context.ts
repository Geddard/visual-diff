import { createContext } from "react";
import { IStep } from "./Steps";

export const StepsContext = createContext<{
    steps: IStep[],
    setSteps: any,
}>({
    setSteps: () => null,
    steps: [],
});
