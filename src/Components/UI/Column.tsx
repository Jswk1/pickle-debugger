import * as React from "react";

export const Column = (props: React.PropsWithChildren<{ title: string, borderClass: string, columnCss?: string, collapsed?: boolean, collapseDirection: "vertical" | "horizontal" }>) => {
    const [collapsed, setCollapsed] = React.useState(props.collapsed || false);

    const toggleCollapsed = () => setCollapsed(!collapsed);

    if (collapsed)
        return <h6 onClick={toggleCollapsed} className={`action text-vertical col flex-shrink-1 flex-grow-0 m-0 p-1 border border-1 ${props.borderClass}`}>{props.title}</h6>

    return <div className={`col d-flex flex-column ${props.columnCss || ""}`}>
        <h6 className="action" onClick={toggleCollapsed}>{props.title}</h6>
        <div className="flex-grow-1 overflow-auto">{props.children}</div>
    </div>
}