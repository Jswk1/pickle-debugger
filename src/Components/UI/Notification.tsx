import * as React from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import * as ReactDOM from "react-dom";
import { useNotification } from "../../Hooks/UseNotification";

export type TNotification = {
    id?: number;
    text: string;
    kind: "light" | "danger" | "success"
}

export const NotificationContainer = () => {
    const { notifications } = useNotification();
    const containerEl = document.querySelector("#portal");

    return ReactDOM.createPortal(<>
        <ToastContainer>
            {notifications.map((e, i) => <Notification key={e.id} {...e} />)}
        </ToastContainer>
    </>, containerEl);
}

const Notification = (props: TNotification) => {
    const { removeNotification } = useNotification();

    React.useEffect(() => {
        const timeOut = setTimeout(() => {
            removeNotification(props.id);
        }, 3000);

        return () => {
            clearTimeout(timeOut);
        }
    }, []);

    return <Toast bg={props.kind}>
        <Toast.Body className="text-dark">
            {props.id}
            {props.text}
        </Toast.Body>
    </Toast>
}