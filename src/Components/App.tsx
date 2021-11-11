import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Head } from "./Head";
import { Debugger } from "./Debugger/Debugger";
import { ErrorBoundary } from "../ErrorBoundary";
import "./App.scss";

export const Context = React.createContext<{ title: string, setTitle: (title: string) => void }>({
    title: null,
    setTitle: () => { }
})

export const App = () => {
    const [title, setTitle] = React.useState<string>(null);
    const value = React.useMemo(() => ({ title, setTitle }), [title]);

    return <>
        <Context.Provider value={value}>
            <Head />
            <ErrorBoundary>
                <Debugger />
            </ErrorBoundary>
        </Context.Provider>
    </>
}
