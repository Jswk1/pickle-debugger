import { faSpinner, faPlay, faFastForward, faStepForward, faStop, IconDefinition, faPause, faRemoveFormat, faTextWidth, faCode } from "@fortawesome/free-solid-svg-icons";
import * as React from "react";
import { TFeaturePlayer } from "../../Hooks/UseFeaturePlayer";
import { Button } from "../UI/Button";
import { reloadScripts } from "../../Data";
import { NotificationContext } from "../UI/Notification";

export const Controls = (props: { player: TFeaturePlayer, setIsReloading: (isReloading: boolean) => void; }) => {
    const { player, setIsReloading } = props;
    const canPlay = !player.isPlaying();
    const [tooltip, setTooltip] = React.useState("");
    const { dispatchNotificationAction: dispatch } = React.useContext(NotificationContext);

    const onReload = async () => {
        setIsReloading(true);

        await reloadScripts();
        dispatch({ type: "add", notification: { text: "Scripts reloaded!", kind: "success" } });

        setIsReloading(false);
    }

    return <div className="mb-2">
        <Button class={"btn-success"} icon={canPlay ? faPlay : faSpinner} spinIcon={!canPlay} onClick={() => player.setIsPlayingAll(true)} disabled={!canPlay}>Run Feature</Button>
        <Button class={"btn-success"} icon={faStepForward} onClick={() => player.setIsPlayingCurrentScenario(true)} disabled={!canPlay} >Run scenario</Button>
        <Button class={"btn-success"} icon={faFastForward} onClick={() => player.setIsPlayingCurrentStep(true)} disabled={!canPlay}>Run Step</Button>
        <Button class={"btn-warning"} icon={faPause} onClick={() => player.pause()} />
        <Button class={"btn-danger"} icon={faStop} onClick={() => player.reset(true)} />
        <Button class={"btn-light"} icon={faCode} onClick={onReload} value={"Reload all test source code to account for new changes"}>Force Reload Scripts</Button>

        <small className="mx-1 text-light">{tooltip}</small>
    </div>
}