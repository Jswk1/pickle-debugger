import { IFeature, IScenario, TestStatus } from "./Types";
import * as React from "react";

export const ScenarioList = (props: { feature: IFeature, activeScenario: IScenario, onScenarioClick: (scenario: IScenario) => void }) => {
    const { feature, activeScenario, onScenarioClick } = props;

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

        const isActive = scenario.name === activeScenario?.name;

        return <a key={key} href="#" onClick={() => onScenarioClick(scenario)} className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${isActive ? "fw-bold" : ""}`}>
            {scenario.name}
            <span className={`badge ${getStatusBackground()}`}>{(feature.backgroundSteps?.length || 0) + (scenario.steps?.length || 0)}</span>
        </a>
    }

    return <ul className="list-group">
        {feature.scenarios.map((e, i) => listItem(e, i))}
    </ul>
}