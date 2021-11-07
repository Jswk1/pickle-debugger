import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Head } from "./Head";
import { FeatureViewer } from "./Feature/Feature";
import { ErrorBoundary } from "../ErrorBoundary";

export const App = () =>
    <>
        <Head />
        <ErrorBoundary>
            <FeatureViewer />
        </ErrorBoundary>
    </>
