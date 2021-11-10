import * as React from "react";
import { useFeature } from "../../Hooks/UseFeature";
import { useFeaturePlayer } from "../../Hooks/UseFeaturePlayer";
import { Column } from "../UI/Column";
import { Controls } from "./Controls";
import { ScenarioList } from "./ScenarioList";
import { StepList } from "./StepList";
import { Variables } from "./Variables";

export const Debugger = () => {
    const { loading, feature } = useFeature();
    const [refresh, setRefresh] = React.useState(0);
    const player = useFeaturePlayer(feature);

    React.useEffect(() => {
        player.reset(true);
    }, [feature]);

    React.useEffect(() => { }, [refresh]);

    if (loading)
        return <div>Loading...</div>

    return <>
        <div className="container-fluid pt-2 bg-dark text-light flex-grow-1 overflow-auto d-flex flex-column">
            <Controls player={player} />
            <div className="row flex-grow-1 overflow-auto flex-nowrap">
                <Column title="Scenarios" borderClass="border-primary" columnCss="col-2">
                    <ScenarioList feature={feature} activeScenario={player.currentScenario} onScenarioClick={(scenario) => player.setCurrentScenario(scenario)} />
                </Column>
                <Column title={player.currentScenario.name} borderClass="border-success" columnCss="col d-flex flex-column">
                    <StepList backgroundSteps={feature.backgroundSteps} scenario={player.currentScenario} currentStepId={player.currentStepId}
                        onStepClick={(step) => player.setCurrentStepId(step.id)} onStepBreakpointClick={step => {
                            step.breakpoint = !(!!step.breakpoint);
                            setRefresh(refresh + 1);
                        }} />
                </Column>
                <Column title="Variables" borderClass="border-warning" columnCss="col-2">
                    <Variables variables={player.variables} updateVariables={player.updateVariables} />
                </Column>
            </div>
        </div>
    </>
}