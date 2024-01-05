import * as React from "react";
import { useFeature } from "../../Hooks/UseFeature";
import { useFeaturePlayer } from "../../Hooks/UseFeaturePlayer";
import { IScenario, IStep } from "../../Types";
import { TitleContext } from "../App";
import { Column } from "../UI/Column";
import { Controls } from "./Controls";
import { ScenarioList } from "./ScenarioList";
import { StepList } from "./StepList";
import { Variables } from "./Variables";
import "./Debugger.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Progress } from "./Progress";
import { copyToClipboard } from "../../Utils/Clipboard";
import { NotificationContext } from "../UI/Notification";

export const Debugger = () => {
    const { dispatchNotificationAction: dispatch } = React.useContext(NotificationContext);
    const { loading, feature, setFeature } = useFeature();
    const [isReloading, setIsReloading] = React.useState(false);
    const { setTitle } = React.useContext(TitleContext);
    const player = useFeaturePlayer(feature, setFeature);

    React.useEffect(() => {
        if (!loading) {
            setTitle(feature.name);
            player.reset(true);
        }
    }, [loading]);

    const onScenarioClick = (scenario: IScenario) => {
        if (scenario.id === player.getCurrentScenario().id)
            return;

        player.setCurrentScenarioId(scenario.id);
        if (feature.backgroundSteps?.length > 0)
            player.setCurrentStepId(feature.backgroundSteps[0].id);
        else
            player.setCurrentStepId(scenario.steps[0].id);
    };

    const onStepToggleBreakpoint = (step: IStep) => {
        const mapSteps = (s: IStep): IStep => {
            if (step.id === s.id)
                return { ...s, breakpoint: !(!!s.breakpoint) };
            return s;
        }

        setFeature({
            ...feature,
            backgroundSteps: feature.backgroundSteps.map(mapSteps),
            scenarios: feature.scenarios.map(e => ({
                ...e,
                steps: e.steps.map(mapSteps)
            }))
        });
    }

    const onStepClick = (step: IStep) => {
        if (player.isPlaying())
            return;

        player.setCurrentStepId(step.id);
    }

    const onStepRightClick = (step: IStep) => {
        copyToClipboard(step.definition.pattern);
        dispatch({ type: "add", notification: { text: `Step copied: ${step.name}`, kind: "success" } });
    }

    if (loading)
        return <div>Loading...</div>

    const currentScenario = player.getCurrentScenario();
    const currentScenarioSteps = currentScenario?.steps || [];

    return <>
        <div className="container-fluid pt-2 bg-dark text-light flex-grow-1 overflow-auto d-flex flex-column">
            {isReloading && <div className="loading-layer d-flex">
                <FontAwesomeIcon icon={faSpinner} spin={true} size={"3x"} className="m-auto" />
            </div>}
            <Controls player={player} setIsReloading={setIsReloading} />
            <div className="row flex-grow-1 overflow-auto flex-nowrap">
                <Column title="Scenarios" borderClass="border-primary" columnCss="sidebar" >
                    <ScenarioList feature={feature} currentScenarioId={player.currentScenarioId} onScenarioClick={onScenarioClick} />
                    <Variables variables={player.variables} updateVariables={player.updateVariables} />
                </Column>
                <Column title={currentScenario?.name} borderClass="border-success" columnCss="overflow-auto">
                    <div className="flex-grow-1 overflow-auto">
                        {feature.backgroundSteps?.length > 0 &&
                            <StepList title={"Background Steps"} steps={feature.backgroundSteps} currentStepId={player.currentStepId}
                                onStepClick={onStepClick} onStepRightClick={onStepRightClick} onStepBreakpointClick={onStepToggleBreakpoint} />
                        }
                        {currentScenarioSteps.length > 0 &&
                            <StepList title={"Scenario Steps"} steps={currentScenarioSteps} currentStepId={player.currentStepId}
                                onStepClick={onStepClick} onStepRightClick={onStepRightClick} onStepBreakpointClick={onStepToggleBreakpoint} />
                        }
                    </div>
                </Column>
                <Column title="Info & Tips" borderClass="border-danger" collapsed={true}>
                    <ul>
                        <li>The steps are automatically reloaded when source code is changed.</li>
                        <li>Right click step to copy it's definition for easier search in code.</li>
                    </ul>
                </Column>
            </div>
            <div className="p-2">
                <Progress feature={feature} player={player} />
            </div>
        </div>
    </>
}