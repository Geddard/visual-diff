import React, { useState } from "react";
import io from 'socket.io-client';
import without from "lodash-es/without";
import remove from "lodash-es/remove";

import "./Differ.css";

import Select from "./Select";

const Differ: React.FC = () => {
  const [sourceSelected, setSourceSelected] = useState(false);
  const [sourceUrl, setSourceUrl] = useState("");

  const [compareSelected, setCompareSelected] = useState(false);
  const [compareUrl, setCompareUrl] = useState("");

  const [diffReady, setDiffReady] = useState(false);

  const [imagesReady, setImagesReady] = useState(false);
  const [imagesList, setImagesList] = useState();

  const socket = io("http://localhost");
  socket.connect();
  socket.emit("getImages");

  const renderContent = () => {
    let content = null;

    if (diffReady) {
      content = renderImg(`${sourceUrl.replace(".png", "")}-diff.png`);
    } else {
      content = (
        <div className="differ-form">
          {renderSourceSelector()}
          {renderDiffBtn()}
          {renderCompareTo()}
        </div>
      );
    }

    return content;
  }

  const renderSourceSelector = () => {
    return (
      <div className="source-selector">
        <p>Source Image</p>
        {renderSourceList()}
        {sourceSelected ? renderImg(sourceUrl) : null}
      </div>
    );
  };

  const renderDiffBtn = () => {
    if (sourceSelected && compareSelected) {
      return <button className="diff-btn" onClick={() => doDiff()}>Diff it</button>
    }
  }

  const handleDiffReady = () => {
    setDiffReady(true);
    socket.close();
  }

  const doDiff = () => {
    socket.connect();
    socket.emit("compare", sourceUrl, compareUrl);
    socket.on("diffReady", handleDiffReady);
  }

  const renderCompareTo = () => {
    if (sourceSelected) {
      const imagesToCompare = without(imagesList, sourceUrl);

      if (imagesToCompare.length) {
        return (
          <div className="source-selector">
            <p>
              Compare To
            </p>
            <Select
                className="differ__img-picker"
                options={imagesToCompare}
                onChangeHandler={selectCompareImageHandler}
              />
            {compareSelected ? renderImg(compareUrl) : null}
          </div>
        );
      }
    }
  };

  const handleImagesReady = (images: string[]) => {
    setImagesReady(true);
    setImagesList(remove(images, (image: string) => {
      return image.indexOf("diff") === -1;
    }));
  };

  socket.on("imagesReady", handleImagesReady);

  const renderSourceList = () => {
    if (imagesReady) {
      socket.close();

      return <Select
                className="differ__img-picker"
                options={imagesList || []}
                onChangeHandler={selectImageHandler}
              />;
    }
  };

  const selectImageHandler = (selectedImage: string) => {
    setSourceSelected(true);
    setSourceUrl(selectedImage);
  }

  const selectCompareImageHandler = (selectedImage: string) => {
    setCompareSelected(true);
    setCompareUrl(selectedImage);
  }

  const renderImg = (img: string) => {
    return <img className="differ__img-displayed" src={`/${img}`} alt={img}/>
  }

  return renderContent();
}

export default Differ;
