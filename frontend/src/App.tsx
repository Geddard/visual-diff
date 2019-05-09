import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import io from 'socket.io-client';

const App: React.FC = () => {
  const [imageName, setImageName] = useState("example");
  const [imageUrl, setImageUrl] = useState("example");
  const [isDone, setIsDone] = useState(false);

  const socket = io("http://localhost");
  socket.connect();

  socket.on("done", () => {
    setIsDone(true);
  });

  const shoot = async () => {
    setIsDone(false);
    socket.emit("shoot", {imageName, imageUrl});
  };

  const renderlastImage = () => {
    if (isDone) {
      return <img src={`/${imageName}.png`} alt="witcher"/>
    }
  };

  return (
    <div className="App">
      <header className="App-header">

        <img src={logo} className="App-logo" alt="logo" />

        <label htmlFor="imgName">Image Name</label>
        <input
          id="imgName"
          value={imageName}
          type="text"
          onChange={e => setImageName(e.target.value)}
        />

        <label htmlFor="imgUrl">Image Url</label>
        <input
          id="imgUrl"
          value={imageUrl}
          type="text"
          onChange={e => setImageUrl(e.target.value)}
        />
        <br/>
        <button onClick={shoot}>SHOOT</button>

        {isDone ? <p>Done!</p> : null}

        {renderlastImage()}

      </header>
    </div>
  );
}

export default App;
