import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Head } from "./Head";
import { Debugger } from "./Debugger/Debugger";
import { ErrorBoundary } from "../ErrorBoundary";
import "./App.scss";
import { NotificationContainer, TNotification } from "./UI/Notification";

export const TitleContext = React.createContext<{ title: string, setTitle: (title: string) => void }>({
    title: null,
    setTitle: () => { }
});

export const NotificationContext = React.createContext<{ notifications: TNotification[], setNotifications: (notifications: TNotification[]) => void }>({
    notifications: [],
    setNotifications: () => { }
});

export const App = () => {
    const [title, setTitle] = React.useState<string>(null);
    const titleValue = React.useMemo(() => ({ title, setTitle }), [title]);

    const [notifications, setNotifications] = React.useState<TNotification[]>([]);
    const notificationsValue = React.useMemo(() => ({ notifications, setNotifications }), [notifications]);

    return <>
        <NotificationContext.Provider value={notificationsValue}>
            <TitleContext.Provider value={titleValue}>
                <Head />
                <ErrorBoundary>
                    <Debugger />
                </ErrorBoundary>
                <NotificationContainer />
            </TitleContext.Provider>
        </NotificationContext.Provider>
    </>
}
