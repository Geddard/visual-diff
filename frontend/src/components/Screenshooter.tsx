import React, { useState } from "react";
import io from 'socket.io-client';

import "./Screenshooter.css";

import Input from "./Input";

const Screenshooter: React.FC = () => {
  const [imageName, setImageName] = useState("frontpage");
  const [imageUrl, setImageUrl] = useState("www.gog.com");
  const [hoverElClassName, setHoverElClassName] = useState("");
  const [clickElClassName, setClickElClassName] = useState("");
  const [lastImage, setLastImage] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const socket = io("http://localhost");
  socket.connect();

  socket.on("done", () => {
    setIsDone(true);
    setLoading(false);
    setLastImage(imageName);
  });

  const shoot = async () => {
    setIsDone(false);
    setLoading(true);
    const config = {
      imageName,
      imageUrl
    };

    if (hoverElClassName !== "") {
      Object.assign(config, {hoverElClassName});
    }

    if (clickElClassName !== "") {
      Object.assign(config, {clickElClassName});
    }

    socket.emit("shoot", config);
  };

  const renderLastImage = () => {
    if (isDone) {
      return <img src={`/${lastImage}.png`} alt={lastImage}/>
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

      {loading ? <p className="loading" /> : null}

      {isDone ? <p>Done!</p> : null}

      {renderLastImage()}
    </div>
)};

export default Screenshooter;
