import React from "react";
import ReactDOM from "react-dom";

import { Title } from "../components/Title";

const App = () => {
    return (
        <div>
            <Title/>
        </div>
    );
};

ReactDOM.render(<App/>, document.getElementById("diff-main"));


