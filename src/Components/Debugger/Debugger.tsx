import * as React from "react";
import { useFeature } from "../../Hooks/UseFeature";
import { useFeaturePlayer } from "../../Hooks/UseFeaturePlayer";
import { IScenario, IStep } from "../../Types";
import { Column } from "../UI/Column";
import { Controls } from "./Controls";
import { ScenarioList } from "./ScenarioList";
import { StepList } from "./StepList";
import { Variables } from "./Variables";

export const Debugger = () => {
    const { loading, feature, setFeature } = useFeature();
    const player = useFeaturePlayer(feature, setFeature);

    React.useEffect(() => {
        if (!loading)
            player.reset(true);
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

    const stepToggleBreakpoint = (step: IStep) => {
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

    if (loading)
        return <div>Loading...</div>

    const currentScenario = player.getCurrentScenario();
    const currentScenarioSteps = currentScenario?.steps || [];

    return <>
        <div className="container-fluid pt-2 bg-dark text-light flex-grow-1 overflow-auto d-flex flex-column">
            <Controls player={player} />
            <div className="row flex-grow-1 overflow-auto flex-nowrap">
                <Column title="Scenarios" borderClass="border-primary" columnCss="col-2">
                    <ScenarioList feature={feature} currentScenarioId={player.currentScenarioId} onScenarioClick={onScenarioClick} />
                </Column>
                <Column title={currentScenario?.name} borderClass="border-success" columnCss="col d-flex flex-column">
                    <div className="flex-grow-1 overflow-auto">
                        {feature.backgroundSteps?.length > 0 &&
                            <StepList title={"Background Steps"} steps={feature.backgroundSteps} currentStepId={player.currentStepId}
                                onStepClick={(step) => player.setCurrentStepId(step.id)} onStepBreakpointClick={stepToggleBreakpoint} />
                        }
                        {currentScenarioSteps.length > 0 &&
                            <StepList title={"Scenario Steps"} steps={currentScenarioSteps} currentStepId={player.currentStepId}
                                onStepClick={(step) => player.setCurrentStepId(step.id)} onStepBreakpointClick={stepToggleBreakpoint} />
                        }
                    </div>
                </Column>
                <Column title="Variables" borderClass="border-warning" columnCss="col-2">
                    <Variables variables={player.variables} updateVariables={player.updateVariables} />
                </Column>
            </div>
        </div>
    </>
}