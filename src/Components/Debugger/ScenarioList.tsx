import { IFeature, IScenario, TestStatus } from "../../Types";
import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export const ScenarioList = (props: { feature: IFeature, currentScenarioId: number, onScenarioClick: (scenario: IScenario) => void }) => {
    const { feature, currentScenarioId, onScenarioClick } = props;

    const listItem = (scenario: IScenario, key: number) => {
        const getStatusBackground = () => {
            let hasError = false;
            let hasWarning = false;
            let okCount = 0;

            const steps = [...feature.backgroundSteps, ...scenario.steps];
            for (const step of steps) {
                if (step.outcome?.status === TestStatus.Error)
                    hasError = true;

                if (step.outcome?.status === TestStatus.Warning)
                    hasWarning = true;

                if (step.outcome?.status === TestStatus.Ok)
                    okCount++;
            }

            if (hasError)
                return "bg-danger";

            if (hasWarning)
                return "bg-warning";

            return okCount === steps.length ? "bg-success" : "bg-dark";
        }

        const isActive = scenario.id === currentScenarioId;

        return <tr key={key} onClick={() => onScenarioClick(scenario)} className="action">
            <td>{isActive && <FontAwesomeIcon icon={faArrowRight} />}</td>
            <td>{scenario.name}</td>
            <td className="text-center"><span className={`badge ${getStatusBackground()}`}>{(feature.backgroundSteps?.length || 0) + (scenario.steps?.length || 0)}</span></td>
        </tr >
    }

    return <div className="table-responsive">
        <table className="table table-dark table-striped table-hover table-bordered">
            <thead>
                <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Steps</th>
                </tr>
            </thead>
            <tbody>
                {feature.scenarios.map((e, i) => listItem(e, i))}
            </tbody>
        </table>
    </div>
}