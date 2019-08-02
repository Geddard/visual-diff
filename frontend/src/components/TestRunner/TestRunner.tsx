import React, { useState, useEffect } from "react";
import { createApolloFetch } from "apollo-fetch";

import "./TestRunner.css";
import Axios from "axios";

interface ITestScenario {
    action: string;
    value: string;
    crop: boolean;
    cropTarget: string
}

interface ITest {
    name: string;
    url: string;
    scenarios: ITestScenario[]
    blockImagesChecked: boolean;
    fullPageChecked: boolean;
    takeResultScreenshot: boolean;
}

const TestRunner: React.FC = () => {
  const [testList, setTestList] = useState([])
  const [testsFetched, setTestsFetched] = useState(false);

  useEffect(() => {
    if (!testsFetched) {
      createApolloFetch({ uri: "/gql" })({
        query: `{
          tests {
            blockImagesChecked
            takeResultScreenshot
            fullPageChecked
            name
            url
            scenarios {
              action
              value
              crop
              cropTarget
            }
          }
        }
     `}).then((res: any) => {
        setTestList(res.data.tests);
        setTestsFetched(true);
      });
    }
  }, [testsFetched]);

  const renderTest = (test: ITest, index: number) => {
    return (
      <div key={index} className="test-details">
        ---------------------------------
        <div>Test Name: {test.name}</div>
        <div>Initial URL: {test.url}</div>
        <br/>
        <div>
          Steps: <br/>
          {test.scenarios.map((scenario: ITestScenario, index: number) => {
            return (
              <div key={index}>
                <div className="test-step">
                  ACTION: {scenario.action}
                  <br/>
                  {scenario.value ? "Value: " + scenario.value : null}
                </div>
              </div>
            );
          })}
        </div>
        <br/>
        <div>
          Options: <br/>
          <div>Images blocked: {test.blockImagesChecked ? "enabled" : "disabled"}</div>
          <div>Full page: {test.fullPageChecked ? "enabled" : "disabled"}</div>
          <div>Take final screenshot: {test.takeResultScreenshot ? "enabled" : "disabled"}</div>
        </div>
        <button onClick={() => runTest(test)}>Run test</button>
      </div>
    );
  };

  const runTest = (test: ITest) => {
    Axios.post("/api/shoot", {
        testName: test.name,
        testUrl: test.url,
        steps: test.scenarios
    })
    .then(() => {
        alert("done");
    });
  };

  return (
    <div className="test-list">
      {testList.map(renderTest)}
    </div>
  );
};

export default TestRunner;
