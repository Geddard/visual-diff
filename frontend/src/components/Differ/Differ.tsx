import React, { useState, useEffect } from "react";
import without from "lodash-es/without";
import remove from "lodash-es/remove";
import axios from "axios";

import "./Differ.css";

import Select from "../Select/Select";

const Differ: React.FC = () => {
  const [sourceSelected, setSourceSelected] = useState(false);
  const [sourceUrl, setSourceUrl] = useState("");

  const [compareSelected, setCompareSelected] = useState(false);
  const [compareUrl, setCompareUrl] = useState("");

  const [diffReady, setDiffReady] = useState(false);
  const [diffResult, setDiffResult] = useState(0);

  const [imagesReady, setImagesReady] = useState(false);
  const [imagesList, setImagesList] = useState();

  useEffect(() => {
    axios.get("/api/images")
      .then((response: any) => {
        if (response.data.length) {
          setImagesReady(true);
          setImagesList(remove(response.data, (image: string) => {
            return image.indexOf("diff") === -1;
          }));
        }
      });
  }, []);

  const renderContent = () => {
    let content = null;

    if (diffReady) {
      content = (
        <div className="differ-form">
          <div>
            {"Difference in pixels " + diffResult}
          </div>
          {renderImg(`${sourceUrl.replace(".png", "")}-${compareUrl.replace(".png", "")}-diff.png`)}
        </div>
      );
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

  const doDiff = () => {
    axios.post("/api/compare", {sourceUrl, compareUrl})
      .then((res) => {
        setDiffReady(true);
        setDiffResult(res.data.diffResult);
      });
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

  const renderSourceList = () => {
    if (imagesReady) {

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
