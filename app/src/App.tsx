import React, { useMemo, useState } from "react";
import "./App.css";
import Differ from "./components/Differ/Differ";
import Screenshooter from "./components/Screenshooter/Screenshooter";
import { StepsContext } from "./components/Steps/Steps.context";
import TestRunner from "./components/TestRunner/TestRunner";
import Toggler from "./components/Toggler/Toggler";
import logo from "./logo.svg";

const App: React.FC = () => {
  const OPTIONS = {
    DIFFER: "Differ",
    SAVED_TESTS: "Saved tests",
    SCREENSHOOTER: "Screenshooter"
  };
  const defaultForm = OPTIONS.SCREENSHOOTER;

  const [activeForm, setActiveForm] = useState(defaultForm);
  const [steps, setSteps] = useState([]);

  const stepsContextValue = useMemo(() => ({ steps, setSteps }), [steps, setSteps]);

  const handleTogglerClick = (option: string) => {
    setActiveForm(option);
  };

  const renderActiveForm = () => {
    let formToRender;

    if (activeForm === OPTIONS.SCREENSHOOTER) {
      formToRender = (
        <StepsContext.Provider value={stepsContextValue}>
          <Screenshooter />
        </StepsContext.Provider>
      );
    } else if (activeForm === OPTIONS.DIFFER) {
      formToRender = <Differ />;
    } else if (activeForm === OPTIONS.SAVED_TESTS) {
      formToRender = <TestRunner />;
    }

    return formToRender;
  };

  return (
    <div className="app">
      <div className="app-logo__wrapper">
        <img src={logo} className="app-logo" alt="logo" />
      </div>

      <Toggler options={OPTIONS} defaultOption={defaultForm} handler={handleTogglerClick}>
        {renderActiveForm()}
      </Toggler>
    </div>
  );
};

export default App;
