import React, { useState, Dispatch } from "react";
import logo from "./logo.svg";
import "./App.css";
import io from 'socket.io-client';

const App: React.FC = () => {
  const [imageName, setImageName] = useState("frontpage");
  const [imageUrl, setImageUrl] = useState("www.gog.com");
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
    socket.emit("shoot", {imageName, imageUrl});
  };

  const renderLastImage = () => {
    if (isDone) {
      return <img src={`/${lastImage}.png`} alt="witcher"/>
    }
  };

  const renderInput = (title: string, value: string, setter: Dispatch<React.SetStateAction<string>>) => {
    return (
      <div className="field-container">
        <label className="input-label" htmlFor="imgName">{title}</label>
        <input
          className="input-box"
          id="imgName"
          value={value}
          type="text"
          onChange={e => setter(e.target.value)}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app-header">

        <img src={logo} className="app-logo" alt="logo" />

        <div className="app-form">

          {renderInput("Image Name", imageName, setImageName)}
          {renderInput("Image Url", imageUrl, setImageUrl)}

          <br/>
          <button onClick={shoot}>SHOOT</button>

          {loading ? <p className="loading" /> : null}

          {isDone ? <p>Done!</p> : null}

          {renderLastImage()}
        </div>

      </div>
    </div>
  );
}

export default App;
