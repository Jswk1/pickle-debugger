import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Head } from "./Head";
import { Debugger } from "./Debugger/Debugger";
import { ErrorBoundary } from "../ErrorBoundary";
import "./App.scss";

export const App = () =>
    <>
        <Head />
        <ErrorBoundary>
            <Debugger />
        </ErrorBoundary>
    </>
