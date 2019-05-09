import React from "react";
import logo from "./logo.svg";
import "./App.css";
import * as pptr from "puppeteer";

const App: React.FC = () => {

  const shoot = async () => {
    // const browser = await pptr.connect({
    //   browserWSEndpoint: '<another-browser-ws-endpont>'
    // });
    // const page = await browser.newPage();
    // await page.goto("https://example.com");
    // await page.screenshot({path: "example.png"});

    // await browser.close();
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={shoot}>SHOOT</button>
      </header>
    </div>
  );
}

export default App;
