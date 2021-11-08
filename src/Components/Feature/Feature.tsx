import { faArrowRight, faCheck, faFastForward, faPlay, faSpinner, faStepForward, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Controls } from "./Controls";
import { useFeaturePlayer, useFeature, TFeaturePlayer } from "./FeaturePlayer";
import { IScenario, IStep, StepType, TestStatus } from "./Types";

export const FeatureViewer = () => {
    const { loading, feature, variables } = useFeature();
    const player = useFeaturePlayer(feature);

    React.useEffect(() => {
        player.reset(true);
    }, [feature]);

    if (loading)
        return <div>Loading...</div>

    return <>
        <div className="container-fluid pt-2 bg-dark flex-grow-1 overflow-auto d-flex flex-column">
            <Controls player={player} />
            <div className="row flex-grow-1 overflow-auto flex-nowrap">
                <div className="col-2">
                    <h6 className="text-light">Scenarios</h6>
                    <ScenarioList scenarios={feature.scenarios} activeScenario={player.currentScenario} onScenarioClick={(scenario) => player.setCurrentScenario(scenario)} />
                </div>
                <div className="col d-flex flex-column">
                    <StepList backgroundSteps={feature.backgroundSteps} scenario={player.currentScenario} currentStepId={player.currentStepId} onStepClick={(step) => player.setCurrentStepId(step.id)} />
                </div>
                <div className="col-2">
                    <h6 className="text-light">Variables</h6>
                    <div>
                        {JSON.stringify(variables)}
                    </div>
                </div>
            </div>
        </div>
    </>
}

const ScenarioList = (props: { scenarios: IScenario[], activeScenario: IScenario, onScenarioClick: (scenario: IScenario) => void }) => {
    const { scenarios, activeScenario, onScenarioClick } = props;

    const listItem = (scenario: IScenario, key: number) => {
        const isActive = scenario.name === activeScenario?.name;

        return <a key={key} href="#" onClick={() => onScenarioClick(scenario)} className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${isActive ? "active" : ""}`}>
            {scenario.name}
            <span className="badge badge-primary badge-pill">{scenario.steps.length}</span>
        </a>
    }

    return <ul className="list-group">
        {scenarios.map((e, i) => listItem(e, i))}
    </ul>
}

const StepList = (props: { scenario: IScenario, backgroundSteps: IStep[], currentStepId: number, onStepClick: (step: IStep) => void }) => {
    const { scenario, backgroundSteps, currentStepId, onStepClick } = props;

    if (!scenario)
        return null;

    const getStep = (step: IStep, key: any) => {
        const getRowColor = () => {
            switch (step.lastStatus) {
                case TestStatus.Ok: return "table-success";
                case TestStatus.Error: return "table-danger";
                case TestStatus.Skipped: return "table-warning";
                default: return "";
            }
        }

        return <tr key={key} onClick={() => onStepClick(step)} className={getRowColor()}>
            <td style={{ width: "25px" }}>
                {step.id === currentStepId && <FontAwesomeIcon icon={faArrowRight} />}
            </td>
            <td>
                <div className={step.type === StepType.Background ? "text-primary" : ""}>{step.name}</div>
            </td>
        </tr>
    }

    return <>
        <h6 className="text-light">{scenario.name}</h6>
        <div className="flex-grow-1 overflow-auto">
            <table className="table table-dark table-sm table-bordered table-striped table-hover caption-top">
                <tbody>
                    {backgroundSteps.map((e, i) => getStep(e, i))}
                    {scenario.steps.map((e, i) => getStep(e, i))}
                </tbody>
            </table>
        </div>
    </>
}