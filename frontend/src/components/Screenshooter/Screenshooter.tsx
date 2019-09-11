import axios from "axios";
import React, { useContext, useState  } from "react";

import "./Screenshooter.css";

import Checkbox from "../Checkbox/Checkbox";
import Input from "../Input/Input";
import Steps from "../Steps/Steps";

import { StepsContext } from "../Steps/Steps.context";

const Screenshooter: React.FC = () => {
  const [testName, setTestName] = useState("frontpage");
  const [testUrl, setTestUrl] = useState("www.gog.com");

  const [fullPageChecked, setFullPageChecked] = useState(false);
  const [blockImagesChecked, setBlockImagesChecked] = useState(false);
  const [takeResultScreenshot, setTakeResultScreenshot] = useState(false);

  const [evidence, setEvidence] = useState([]);
  const [cacheKey, setCacheKey] = useState(0);

  const [isDone, setIsDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const steps = useContext(StepsContext).steps;

  const shoot = () => {
    setIsDone(false);
    setLoading(true);

    const config = {
      blockImagesChecked,
      fullPageChecked,
      steps,
      takeResultScreenshot,
      testName,
      testUrl,
    };

    axios.post("/api/shoot", config)
      .then((res) => {
        setIsDone(true);
        setLoading(false);
        setCacheKey(new Date().getTime());
        setEvidence(res.data);
      });
  };

  const save = () => {
    const config = {
      blockImagesChecked,
      fullPageChecked,
      steps,
      takeResultScreenshot,
      testName,
      testUrl,
    };

    axios.post("/api/save", config)
      .then((res) => {
        alert(res);
      });
  };

  const renderImage = (image: string) => {
    return (
      <div className="screenshot-wrapper">
        <span className="screenshot-title">
          {image.split(".jpg")[0]}
        </span>
        <img
          className="screenshot"
          src={`/${image}?cacheKey=${cacheKey}`}
          alt={image}
          onClick={() => window.open(`/${image}`, "_blank")}
        />
      </div>
    );
  };

  const renderEvidence = () => {
    if (isDone && evidence.length) {
      return (
        <div className="screenshot-gallery">
          {evidence.map(renderImage)}
        </div>
      );
    }
  };

  return (
    <div className="screenshooter-form">

      <Input title="Test Name" value={testName} setter={setTestName}/>
      <Input title="URL" value={testUrl} setter={setTestUrl}/>

      <Steps />

      <br/>

      <button className="screenshooter-btn" onClick={shoot}>
        Run { steps.length ? "tasks" : "task" }
      </button>

      <button className="screenshooter-btn" onClick={save}>
        Save test
      </button>

      <div className="options">
        OPTIONS
        <Checkbox
          name="fullPage"
          setter={setFullPageChecked}
          label="Full Page"
          customClassName="screenshooter__checkbox"
        />
        <Checkbox
          name="blockImages"
          setter={setBlockImagesChecked}
          label="Block Images"
          customClassName="screenshooter__checkbox"
        />
        <Checkbox
          name="blockImages"
          setter={setTakeResultScreenshot}
          label="Take screenshot after finishing"
          customClassName="screenshooter__checkbox"
        />
      </div>

      {loading ? <p className="loading" /> : null}

      {isDone ? <p>Done!</p> : null}

      {renderEvidence()}
    </div>
  );
};

export default Screenshooter;
