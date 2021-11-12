import * as React from "react";
import { TitleContext } from "./App";

export const Head = () => {
    const { title } = React.useContext(TitleContext);

    return <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
            <h3 className="navbar-brand user-select-none">
                Pickle Debugger - {title} <small className="text-muted">Feature</small>
            </h3>
        </div>
    </nav>
}