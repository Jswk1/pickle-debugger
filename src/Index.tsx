import * as React from "react";
import * as ReactDOMClient from "react-dom/client";
import { App } from "./Components/App";


const root = ReactDOMClient.createRoot(document.getElementById("app"));
root.render(<App />);