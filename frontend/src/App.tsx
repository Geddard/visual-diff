import React, { useState, useMemo } from "react";
import logo from "./logo.svg";

import "./App.css";

import Screenshooter from "./components/Screenshooter/Screenshooter";
import Differ from "./components/Differ/Differ";
import Toggler from "./components/Toggler/Toggler";

import { StepsContext } from "./components/Steps/Steps.context";

const App: React.FC = () => {
  const OPTIONS = {
    SCREENSHOOTER: "Screenshooter",
    DIFFER: "Differ",

  };
  const defaultForm = OPTIONS.SCREENSHOOTER;

  const [activeForm, setActiveForm] = useState(defaultForm);
  const [steps, setSteps] = useState([]);

  const stepsContextValue = useMemo(() => ({ steps, setSteps }), [steps, setSteps]);

  const handleTogglerClick = (option: string) => {
    setActiveForm(option);
  }

  const renderActiveForm = () => {
    return activeForm === OPTIONS.SCREENSHOOTER
      ? (
          <StepsContext.Provider value={stepsContextValue}>
            <Screenshooter />
          </StepsContext.Provider>
        )
      : <Differ />;
  }

  return (
    <div className="app">
      <div className="app-logo__wrapper">
        <img src={logo} className="app-logo" alt="logo" />
      </div>

      <Toggler
        options={OPTIONS}
        defaultOption={defaultForm}
        handler={handleTogglerClick}
      >
        {renderActiveForm()}
      </Toggler>
    </div>
)};

export default App;
