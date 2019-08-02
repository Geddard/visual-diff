import React, { useEffect, useState } from "react";
import { createApolloFetch } from "apollo-fetch";

import "./TestRunner.css";

interface ITestScenario {
    action: string;
    value: string;
    crop: boolean;
    cropToTarget: string
}

interface ITest {
    name: string;
    url: string;
    scenarios: ITestScenario[]
}

const TestRunner: React.FC = () => {
  const [testList, setTestList] = useState([])

  const fetch = createApolloFetch({
    uri: "/gql",
  });

  useEffect(() => {
    fetch({ query: `{
      tests {
        name
        url
        scenarios {
          action
          value
          crop
          cropToTarget
        }
      }
    }`}).then((res: any) => {
      setTestList(res.data.tests);
    });
  });

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
        </div>
    );
  };

    return (
        <div className="test-list">
            {testList.map(renderTest)}
        </div>
    )
};

export default TestRunner;
