import * as React from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import * as ReactDOM from "react-dom";
import { useTimeout } from "../../Hooks/UseTimeout";

export const NotificationContext = React.createContext<{ notifications: TNotification[], dispatchNotificationAction: React.Dispatch<TNotificationAction> }>(null);

let notificationId = 1;

type TNotificationAction =
    | { type: "add", notification: TNotification }
    | { type: "remove", id: number }

export const notificationReducer = (state: TNotification[], action: TNotificationAction) => {
    switch (action.type) {
        case "add":
            action.notification.id = ++notificationId;
            return state.concat(action.notification);
        case "remove":
            return state.filter(e => e.id !== action.id);
        default:
            return state;
    }
}

export type TNotification = {
    id?: number;
    text: string;
    kind: "info" | "light" | "danger" | "success";
}

export const NotificationContainer = () => {
    const { notifications } = React.useContext(NotificationContext);
    const containerEl = document.querySelector("#portal");

    return ReactDOM.createPortal(<>
        <ToastContainer position="bottom-end">
            {notifications.map(e => <Notification key={e.id} {...e} />)}
        </ToastContainer>
    </>, containerEl);
}

const Notification = (props: TNotification) => {
    const { dispatchNotificationAction: dispatch } = React.useContext(NotificationContext);

    useTimeout(() => {
        dispatch({ type: "remove", id: props.id });
    }, 5000);

    return <Toast bg={props.kind} className="fade">
        <Toast.Body className={props.kind === "light" ? "text-dark" : "text-light"}>
            {props.text}
        </Toast.Body>
    </Toast>
}