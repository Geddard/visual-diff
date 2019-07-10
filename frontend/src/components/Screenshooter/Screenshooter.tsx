import React, { useState, useContext } from "react";
import axios from "axios";

import "./Screenshooter.css";

import Input from "../Input/Input";
import Checkbox from "../Checkbox/Checkbox";
import Steps from "../Steps/Steps";

import { StepsContext } from "../Steps/Steps.context";

const Screenshooter: React.FC = () => {
  const [imageName, setImageName] = useState("frontpage");
  const [imageUrl, setImageUrl] = useState("www.gog.com");

  const [fullPageChecked, setFullPageChecked] = useState(false);
  const [blockImagesChecked, setBlockImagesChecked] = useState(false);
  const [takeResultScreenshot, setTakeResultScreenshot] = useState(false);

  const [lastImage, setLastImage] = useState("");
  const [cacheKey, setCacheKey] = useState(0);

  const [isDone, setIsDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const steps = useContext(StepsContext).steps;

  const shoot = async () => {
    setIsDone(false);
    setLoading(true);

    const config = {
      imageName,
      imageUrl,
      steps,
      fullPageChecked,
      blockImagesChecked,
      takeResultScreenshot
    };

    axios.post("/api/shoot", config)
      .then(() => {
        setIsDone(true);
        setLoading(false);
        setCacheKey(new Date().getTime());
        setLastImage(imageName);
      });
  }

  const renderLastImage = () => {
    if (isDone && takeResultScreenshot) {
      return (
        <div className="imgage__wrapper">
          <img className="screenshot" src={`/${lastImage}.png?cacheKey=${cacheKey}`} alt={lastImage}/>
        </div>
      );
    }
  };

  return (
    <div className="screenshooter-form">

      <Input title="Image Name" value={imageName} setter={setImageName}/>
      <Input title="URL" value={imageUrl} setter={setImageUrl}/>

      <Steps />

      <br/>

      <button className="screenshooter-btn" onClick={shoot}>
        Run { steps.length ? "tasks" : "task" }
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

      {renderLastImage()}
    </div>
)};

export default Screenshooter;
