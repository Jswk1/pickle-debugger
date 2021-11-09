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
                <Column title="Scenarios" borderClass="border-primary" columnCss="col-2">
                    <ScenarioList scenarios={feature.scenarios} activeScenario={player.currentScenario} onScenarioClick={(scenario) => player.setCurrentScenario(scenario)} />
                </Column>
                <Column title={player.currentScenario.name} borderClass="border-success" columnCss="col d-flex flex-column">
                    <StepList backgroundSteps={feature.backgroundSteps} scenario={player.currentScenario} currentStepId={player.currentStepId}
                        onStepClick={(step) => player.setCurrentStepId(step.id)} onStepBreakpointClick={step => {
                            step.breakpoint = !(!!step.breakpoint);
                            setRefresh(refresh + 1);
                        }} />
                </Column>
                <Column title="Variables" borderClass="border-warning" columnCss="col-2">
                    <Variables variables={player.variables} />
                </Column>
            </div>
        </div>
    </>
}

const Column = (props: React.PropsWithChildren<{ title: string, borderClass: string, columnCss: string, collapsed?: boolean }>) => {
    const [collapsed, setCollapsed] = React.useState(props.collapsed || false);

    const toggleCollapsed = () => setCollapsed(!collapsed);

    if (collapsed)
        return <h6 onClick={toggleCollapsed} className={`action text-vertical col flex-shrink-1 flex-grow-0 m-0 p-1 border border-1 ${props.borderClass}`}>{props.title}</h6>

    return <div className={props.columnCss}>
        <h6 className="action" onClick={toggleCollapsed}>{props.title}</h6>
        {props.children}
    </div>
}