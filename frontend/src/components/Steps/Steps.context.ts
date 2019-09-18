import { createContext } from "react";
import { IStep } from "./Steps.config";

interface IStepsContext {
  steps: IStep[];
  setSteps: any;
}

export const StepsContext = createContext<IStepsContext>({
  setSteps: () => null,
  steps: []
});
