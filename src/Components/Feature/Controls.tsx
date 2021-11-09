import { faSpinner, faPlay, faFastForward, faStepForward, faStop, IconDefinition, faPause } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { reloadScripts } from "./Data";
import { TFeaturePlayer } from "./FeaturePlayer";

export const Controls = (props: { player: TFeaturePlayer }) => {
    const { player } = props;
    const canPlay = !player.isPlayingCurrentStep && !player.isPlayingAll && !player.isPlayingCurrentScenario;
    const [tooltip, setTooltip] = React.useState("");

    return <div className="mb-2">
        <ControlButton backgroundCss={"btn-success"} icon={canPlay ? faPlay : faSpinner} spinIcon={!canPlay} onClick={() => player.setIsPlayingCurrentStep(true)} onHover={e => setTooltip(e)} tooltip={"Run step"} disabled={!canPlay} />
        <ControlButton backgroundCss={"btn-success"} icon={faStepForward} onClick={() => player.setIsPlayingCurrentScenario(true)} onHover={e => setTooltip(e)} tooltip={"Run scenario"} disabled={!canPlay} />
        <ControlButton backgroundCss={"btn-success"} icon={faFastForward} onClick={() => player.setIsPlayingAll(true)} onHover={e => setTooltip(e)} tooltip={"Run feature"} disabled={!canPlay} />
        <ControlButton backgroundCss={"btn-warning"} icon={faPause} onClick={() => player.pause()} onHover={e => setTooltip(e)} tooltip={"Pause after current step"} disabled={false} />
        <ControlButton backgroundCss={"btn-danger"} icon={faStop} onClick={() => player.reset(true)} onHover={e => setTooltip(e)} tooltip={"Reset to start"} disabled={false} />
        <button type="button" className="btn btn-light mx-1" onClick={() => reloadScripts()}>Reload Scripts</button>

        <small className="mx-1 text-muted">{tooltip}</small>
    </div>
}

const ControlButton = (props: {
    backgroundCss: string,
    icon: IconDefinition,
    spinIcon?: boolean,
    onClick: () => void,
    onHover: (tooltip: string) => void,
    tooltip: string,
    disabled: boolean
}) => <>
        <button type="button" className={`btn ${props.backgroundCss} mx-1`} disabled={props.disabled} onClick={props.onClick} onMouseEnter={() => props.onHover(props.tooltip)} onMouseLeave={() => props.onHover("")}>
            <FontAwesomeIcon icon={props.icon} spin={props.spinIcon} />
        </button>
    </>