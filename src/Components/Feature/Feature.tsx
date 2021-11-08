import * as React from "react";
import { Controls } from "./Controls";
import { useFeaturePlayer, useFeature, TFeaturePlayer } from "./FeaturePlayer";
import { ScenarioList } from "./ScenarioList";
import { StepList } from "./StepList";
import { Variables } from "./Variables";

export const FeatureViewer = () => {
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
                <div className="col-2">
                    <h6>Scenarios</h6>
                    <ScenarioList scenarios={feature.scenarios} activeScenario={player.currentScenario} onScenarioClick={(scenario) => player.setCurrentScenario(scenario)} />
                </div>
                <div className="col d-flex flex-column">
                    <StepList backgroundSteps={feature.backgroundSteps} scenario={player.currentScenario} currentStepId={player.currentStepId}
                        onStepClick={(step) => player.setCurrentStepId(step.id)} onStepBreakpointClick={step => {
                            step.breakpoint = !(!!step.breakpoint);
                            setRefresh(refresh + 1);
                        }} />
                </div>
                <div className="col-2">
                    <h6>Variables</h6>
                    <Variables variables={player.variables} />
                </div>
            </div>
        </div>
    </>
}

