import React, { useState } from "react";
import logo from "./logo.svg";

import "./App.css";

import Screenshooter from "./components/Screenshooter";
import Differ from "./components/Differ";
import Toggler from "./components/Toggler";

const App: React.FC = () => {
  const OPTIONS = {
    SCREENSHOOTER: "Screenshooter",
    DIFFER: "Differ"
  };

  const [activeForm, setActiveForm] = useState(OPTIONS.SCREENSHOOTER);

  const handleTogglerClick = (option: string) => {
    setActiveForm(option);
  }

const renderActiveForm = () => {
  return activeForm === OPTIONS.SCREENSHOOTER
    ? <Screenshooter />
    : <Differ />;
}

  return (
    <div className="app">
          <img src={logo} className="app-logo" alt="logo" />

          <Toggler
            options={OPTIONS}
            defaultOption={OPTIONS.SCREENSHOOTER}
            handler={handleTogglerClick}
          />

          {renderActiveForm()}

    </div>
)};

export default App;
