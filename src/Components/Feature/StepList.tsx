import { faArrowRight, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { IScenario, IStep, TestStatus, StepType } from "./Types";

export const StepList = (props: { scenario: IScenario, backgroundSteps: IStep[], currentStepId: number, onStepClick: (step: IStep) => void, onStepBreakpointClick: (step: IStep) => void }) => {
    const { scenario, backgroundSteps, currentStepId, onStepClick, onStepBreakpointClick } = props;

    if (!scenario)
        return null;

    const getStep = (step: IStep, key: any) => {
        const getRowColor = () => {
            switch (step.outcome?.status) {
                case TestStatus.Ok: return "text-success";
                case TestStatus.Error: return "text-danger";
                case TestStatus.Skipped: return "text-warning";
                default: return "";
            }
        }

        return <tr key={key}>
            <td onClick={() => onStepBreakpointClick(step)} className="action">
                <span className={`${step.breakpoint ? "text-danger" : ""}`}><FontAwesomeIcon icon={faCircle} /></span>
            </td>
            <td>
                {step.id === currentStepId && <FontAwesomeIcon icon={faArrowRight} />}
            </td>
            <td>
                {step.type === StepType.Background ? <span className="text-primary">BG</span> : <span className="text-light">SC</span>}
            </td>
            <td onClick={() => onStepClick(step)} className={"w-100 action " + getRowColor()}>
                <div>{step.name}</div>
                {step.outcome?.error && <pre>{step.outcome?.error}</pre>}
            </td>
        </tr>
    }

    return <>
        <div className="flex-grow-1 overflow-auto">
            <table className="table w-auto table-dark table-sm table-bordered table-striped table-hover caption-top">
                <tbody>
                    {backgroundSteps.map((e, i) => getStep(e, i))}
                    {scenario.steps.map((e, i) => getStep(e, i))}
                </tbody>
            </table>
        </div>
    </>
}