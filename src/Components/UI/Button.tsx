import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";

export const Button = (props: React.PropsWithChildren<{
    class: string,
    icon: IconDefinition,
    spinIcon?: boolean,
    onClick?: () => void,
    onHover?: (tooltip: string) => void,
    tooltip?: string,
    text?: string,
    disabled?: boolean
}>) => <>
        <button type="button" className={`btn ${props.class} mx-1`} disabled={props.disabled}
            onClick={props.onClick}
            onMouseEnter={() => props.onHover && props.onHover(props.tooltip)}
            onMouseLeave={() => props.onHover && props.onHover("")}>
            <FontAwesomeIcon fixedWidth={true} icon={props.icon} spin={props.spinIcon} />
            {props.children && <span className="ms-1">{props.children}</span>}
        </button>
    </>