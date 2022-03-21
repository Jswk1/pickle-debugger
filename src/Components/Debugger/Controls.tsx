import { faSpinner, faPlay, faFastForward, faStepForward, faStop, IconDefinition, faPause, faRemoveFormat, faTextWidth, faCode } from "@fortawesome/free-solid-svg-icons";
import * as React from "react";
import { TFeaturePlayer } from "../../Hooks/UseFeaturePlayer";
import { Button } from "../UI/Button";
import { reloadScripts } from "../../Data";
import { NotificationContext } from "../UI/Notification";

export const Controls = (props: { player: TFeaturePlayer }) => {
    const { player } = props;
    const canPlay = !player.isPlayingCurrentStep && !player.isPlayingAll && !player.isPlayingCurrentScenario;
    const [tooltip, setTooltip] = React.useState("");
    const { dispatchNotificationAction: dispatch } = React.useContext(NotificationContext);

    const onReload = async () => {
        await reloadScripts();
        dispatch({ type: "add", notification: { text: "Scripts reloaded!", kind: "success" } })
    }

    return <div className="mb-2">
        <Button class={"btn-success"} icon={canPlay ? faPlay : faSpinner} spinIcon={!canPlay} onClick={() => player.setIsPlayingAll(true)} onHover={e => setTooltip(e)} tooltip={"Run feature"} disabled={!canPlay} />
        <Button class={"btn-success"} icon={faStepForward} onClick={() => player.setIsPlayingCurrentScenario(true)} onHover={e => setTooltip(e)} tooltip={"Run scenario"} disabled={!canPlay} />
        <Button class={"btn-success"} icon={faFastForward} onClick={() => player.setIsPlayingCurrentStep(true)} onHover={e => setTooltip(e)} tooltip={"Run step"} disabled={!canPlay} />
        <Button class={"btn-warning"} icon={faPause} onClick={() => player.pause()} onHover={e => setTooltip(e)} tooltip={"Pause after current step"} />
        <Button class={"btn-danger"} icon={faStop} onClick={() => player.reset(true)} onHover={e => setTooltip(e)} tooltip={"Reset to start"} />
        <Button class={"btn-light"} icon={faCode} onClick={onReload} onHover={e => setTooltip(e)} tooltip={"Reload all test source code to account for new changes"}>Reload Scripts</Button>

        <small className="mx-1 text-light">{tooltip}</small>
    </div>
}