import React, { useState } from "react";
import axios from "axios";

import "./Screenshooter.css";

import Input from "./Input";
import Checkbox from "./Checkbox";

const Screenshooter: React.FC = () => {
  const [imageName, setImageName] = useState("frontpage");
  const [imageUrl, setImageUrl] = useState("www.gog.com");

  const [hoverElClassName, setHoverElClassName] = useState("");
  const [clickElClassName, setClickElClassName] = useState("");

  const [fullPageChecked, setFullPageChecked] = useState(false);
  const [blockImagesChecked, setBlockImagesChecked] = useState(false);

  const [lastImage, setLastImage] = useState("");
  const [cacheKey, setCacheKey] = useState(0);

  const [isDone, setIsDone] = useState(false);
  const [loading, setLoading] = useState(false);


  const shoot = async () => {
    setIsDone(false);
    setLoading(true);
    const config = {
      imageName,
      imageUrl,
      fullPageChecked,
      blockImagesChecked
    };

    if (hoverElClassName !== "") {
      Object.assign(config, {hoverElClassName});
    }

    if (clickElClassName !== "") {
      Object.assign(config, {clickElClassName});
    }

    axios.post("/api/shoot", config)
      .then(() => {
        setIsDone(true);
        setLoading(false);
        setCacheKey(new Date().getTime());
        setLastImage(imageName);
      });
  }

  const renderLastImage = () => {
    if (isDone) {
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
      <Input title="Image Url" value={imageUrl} setter={setImageUrl}/>
      <Input title="(Optional) Hover element" value={hoverElClassName} setter={setHoverElClassName}/>
      <Input title="(Optional) Click element" value={clickElClassName} setter={setClickElClassName}/>

      <br/>

      <button className="screenshooter-btn" onClick={shoot}>Take screenshot</button>
      <div className="options">
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
      </div>

      {loading ? <p className="loading" /> : null}

      {isDone ? <p>Done!</p> : null}

      {renderLastImage()}
    </div>
)};

export default Screenshooter;
