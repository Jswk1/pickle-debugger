import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { IScenario, IStep, TestStatus, StepType } from "./Types";

export const StepList = (props: { scenario: IScenario, backgroundSteps: IStep[], currentStepId: number, onStepClick: (step: IStep) => void }) => {
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
        <h6>{scenario.name}</h6>
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