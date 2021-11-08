import { IScenario } from "./Types";
import * as React from "react";

export const ScenarioList = (props: { scenarios: IScenario[], activeScenario: IScenario, onScenarioClick: (scenario: IScenario) => void }) => {
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