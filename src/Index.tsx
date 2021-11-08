import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./Components/App";

document.body.classList.add("h-100", "w-100");
document.documentElement.classList.add("h-100", "w-100");

ReactDOM.render(<App />, document.getElementById("app"));