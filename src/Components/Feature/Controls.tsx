import { faSpinner, faPlay, faFastForward, faStepForward, faStop, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { TFeaturePlayer } from "./FeaturePlayer";

const ControlButton = (props: { backgroundCss: string, icon: IconDefinition, spinIcon?: boolean, onClick: () => void, onHover: (tooltip: string) => void, tooltip: string, disabled: boolean }) => {
    return <>
        <button type="button" className={`btn btn-lg ${props.backgroundCss} mx-1`} disabled={props.disabled} onClick={props.onClick} onMouseEnter={() => props.onHover(props.tooltip)} onMouseLeave={() => props.onHover("")}>
            <FontAwesomeIcon icon={props.icon} spin={props.spinIcon} />
        </button>
    </>
}

export const Controls = (props: { player: TFeaturePlayer }) => {
    const { player } = props;
    const canPlay = !player.isPlaying && !player.isAutoplaying;
    const [tooltip, setTooltip] = React.useState("");

    return <div className="mb-2">
        <ControlButton backgroundCss={canPlay ? "btn-light" : "btn-success"} icon={canPlay ? faPlay : faSpinner} spinIcon={!canPlay} onClick={() => player.setIsAutoplaying(true)} onHover={e => setTooltip(e)} tooltip={"Run current scenario"} disabled={!canPlay} />
        <ControlButton backgroundCss={"btn-light"} icon={faStepForward} onClick={() => player.setIsPlaying(true)} onHover={e => setTooltip(e)} tooltip={"Run step"} disabled={!canPlay} />
        <ControlButton backgroundCss={"btn-light"} icon={faFastForward} onClick={() => player.setIsAutoplaying(true)} onHover={e => setTooltip(e)} tooltip={"Run to end"} disabled={!canPlay} />
        <ControlButton backgroundCss={canPlay ? "btn-light" : "btn-warning"} icon={faStop} onClick={() => player.stop()} onHover={e => setTooltip(e)} tooltip={"Stop"} disabled={false} />

        <small className="mx-1 text-muted">{tooltip}</small>
    </div>
}