import React from "react";
import logo from "./logo.svg";

import "./App.css";

import Screenshooter from "./components/Screenshooter";

const App: React.FC = () => (
  <div className="app">
        <img src={logo} className="app-logo" alt="logo" />

        <Screenshooter />
  </div>
);

export default App;
