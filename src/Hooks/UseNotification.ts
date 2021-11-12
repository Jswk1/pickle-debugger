import * as React from "react";
import { NotificationContext } from "../Components/App";
import { TNotification } from "../Components/UI/Notification";

let notificationId = 1;
export function useNotification() {
    const { notifications, setNotifications } = React.useContext(NotificationContext);

    const addNotification = (e: TNotification) => {
        e.id = ++notificationId;
        setNotifications(notifications.concat(e));
    }

    const removeNotification = (id: number) => {
        setNotifications(notifications.filter(n => n.id !== id));
    }

    return {
        notifications,
        addNotification,
        removeNotification
    }
}