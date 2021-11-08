import { faArrowRight, faCheck, faPlay, faSpinner, faStepForward, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
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
        <div className="container-fluid pt-2 bg-dark h-100">
            <div className="row">
                <div className="col-2">
                    <h6 className="text-light">Scenarios</h6>
                    <ScenarioList scenarios={feature.scenarios} activeScenario={player.currentScenario} onScenarioClick={(scenario) => player.setCurrentScenario(scenario)} />
                </div>
                <div className="col">
                    <StepList backgroundSteps={feature.backgroundSteps} scenario={player.currentScenario} currentStepId={player.currentStepId} onStepClick={(step) => player.setCurrentStepId(step.id)} />
                </div>
                <div className="col-2">
                    <h6 className="text-light">Variables</h6>
                    <div>
                        {JSON.stringify(variables)}
                    </div>
                </div>
            </div>
            <Controls player={player} />
        </div>
    </>
}

const Controls = (props: { player: TFeaturePlayer }) => {
    const { player } = props;
    const canPlay = !player.isPlaying && !player.isAutoplaying;

    return <div>
        <button type="button" className="btn btn-lg btn-primary mx-1" onClick={() => player.setIsAutoplaying(true)} disabled={!canPlay}>
            {!canPlay && <FontAwesomeIcon icon={faSpinner} spin={true} />}
            {canPlay && <FontAwesomeIcon icon={faPlay} />}
        </button>
        <button type="button" className="btn btn-lg btn-primary mx-1" onClick={() => player.setIsPlaying(true)} disabled={!canPlay}>
            <FontAwesomeIcon icon={faStepForward} />
        </button>
        <button type="button" className="btn btn-lg btn-primary mx-1" onClick={() => player.stop()} onDoubleClick={() => player.reset(true)}>
            <FontAwesomeIcon icon={faStop} />
        </button>
    </div>
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
        <table className="table table-dark table-sm table-bordered table-striped table-hover caption-top">
            <tbody>
                {backgroundSteps.map((e, i) => getStep(e, i))}
                {scenario.steps.map((e, i) => getStep(e, i))}
            </tbody>
        </table>
    </>
}