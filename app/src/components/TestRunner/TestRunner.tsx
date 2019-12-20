import { createApolloFetch } from "apollo-fetch";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { ROUTES } from "../../api/routes/routes";
import "./TestRunner.css";

interface ITestScenario {
  action: string;
  value: string;
  crop: boolean;
  cropTarget: string;
}

interface ITest {
  name: string;
  url: string;
  scenarios: ITestScenario[];
  blockImagesChecked: boolean;
  fullPageChecked: boolean;
  takeResultScreenshot: boolean;
}

const TestRunner: React.FC = () => {
  const [testList, setTestList] = useState([]);
  const [testsFetched, setTestsFetched] = useState(false);
  const [puppetReady, setPuppetReady] = useState(false);

  useEffect(() => {
    if (!puppetReady) {
      Axios.post("/init", {}).then(() => {
        setPuppetReady(true);
      });
    }
  }, [puppetReady]);

  useEffect(() => {
    const cleanup = () => {
      Axios.get("/close");
      window.removeEventListener("beforeunload", cleanup);
    };

    window.addEventListener("beforeunload", cleanup);
    return cleanup;
  }, []);

  useEffect(() => {
    if (!testsFetched) {
      createApolloFetch({ uri: ROUTES.GQL })({
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
     `
      }).then((res: any) => {
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
        <br />
        {renderScenarios(test)}
        <br />
        <div>
          Options: <br />
          <div>Images blocked: {test.blockImagesChecked ? "enabled" : "disabled"}</div>
          <div>Full page: {test.fullPageChecked ? "enabled" : "disabled"}</div>
          <div>Take final screenshot: {test.takeResultScreenshot ? "enabled" : "disabled"}</div>
        </div>
        <button onClick={() => runTest(test)}>Run test</button>
      </div>
    );
  };

  const renderScenarios = (test: ITest) => {
    if (test.scenarios) {
      return (
        <div>
          Steps: <br />
          {test.scenarios.map((scenario: ITestScenario, index: number) => {
            return (
              <div key={index}>
                <div className="test-step">
                  ACTION: {scenario.action}
                  <br />
                  {scenario.value ? "Value: " + scenario.value : null}
                </div>
              </div>
            );
          })}
        </div>
      );
    }
  };

  const runTest = (test: ITest) => {
    Axios.post("/shoot", {
      steps: test.scenarios,
      testName: test.name,
      testUrl: test.url
    }).then(() => {
      alert("done");
    });
  };

  return <div className="test-list">{testList.map(renderTest)}</div>;
};

export default TestRunner;
