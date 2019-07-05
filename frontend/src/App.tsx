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
    DIFFER: "Differ"
  };
  const defaultForm = OPTIONS.SCREENSHOOTER;

  const [activeForm, setActiveForm] = useState(defaultForm);
  const [steps, setSteps] = useState([]);

  const contextValue = useMemo(() => ({ steps, setSteps }), [steps, setSteps]);

  const handleTogglerClick = (option: string) => {
    setActiveForm(option);
  }

  const renderActiveForm = () => {
    return activeForm === OPTIONS.SCREENSHOOTER
      ? (
          <StepsContext.Provider value={contextValue}>
            <Screenshooter />
          </StepsContext.Provider>
        )
      : <Differ />;
  }

  return (
    <div className="app">
          <img src={logo} className="app-logo" alt="logo" />

          <Toggler
            options={OPTIONS}
            defaultOption={defaultForm}
            handler={handleTogglerClick}
          />

          {renderActiveForm()}

    </div>
)};

export default App;
