import { faArrowRight, faCircle, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { IScenario, IStep, TestStatus, StepType } from "../../Types";
import { copyToClipboard } from "../../Utils/Clipboard";

export const StepList = (props: { scenario: IScenario, backgroundSteps: IStep[], currentStepId: number, onStepClick: (step: IStep) => void, onStepBreakpointClick: (step: IStep) => void }) => {
    const { scenario, backgroundSteps, currentStepId, onStepClick, onStepBreakpointClick } = props;

    if (!scenario)
        return null;

    React.useLayoutEffect(() => {
        const el = document.querySelector(`[step-id="${currentStepId}"]`);
        if (el)
            el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, [currentStepId]);

    const getStep = (step: IStep, key: any) => {
        const getRowColor = () => {
            switch (step.outcome?.status) {
                case TestStatus.Ok: return "text-success";
                case TestStatus.Error: return "text-danger";
                case TestStatus.Skipped: return "text-warning";
                default: return "";
            }
        }

        return <tr key={key} step-id={step.id}>
            <td onClick={() => onStepBreakpointClick(step)} className="action">
                <span className={`${step.breakpoint ? "text-danger" : ""}`}><FontAwesomeIcon icon={faCircle} /></span>
            </td>
            <td style={{ minWidth: "25px" }}>
                {step.id === currentStepId && <FontAwesomeIcon icon={faArrowRight} />}
            </td>
            <td onClick={() => onStepClick(step)} className={"w-100 action " + getRowColor()}>
                <Step step={step} />
            </td>
        </tr>
    }

    return <>
        <div className="flex-grow-1 overflow-auto">
            <table className="table w-auto table-dark table-sm table-bordered table-striped table-hover caption-top">
                <caption>Background Steps</caption>
                <tbody>
                    {backgroundSteps.map((e, i) => getStep(e, i))}
                </tbody>
            </table>
            <table className="table w-auto table-dark table-sm table-bordered table-striped table-hover caption-top">
                <caption>Scenario Steps</caption>
                <tbody>
                    {scenario.steps.map((e, i) => getStep(e, i))}
                </tbody>
            </table>
        </div>
    </>
}

const Step = (props: { step: IStep }) => {
    const { step } = props;

    const [copyVisible, setCopyVisible] = React.useState(false);

    const parts = /(when|then|and|given)(.*)/i.exec(step.name);
    const keyword = parts[1].trim();
    const shouldIdent = keyword.toLowerCase() === "and";
    const stepName = parts[2].trim();

    return <>
        <div className="d-flex align-items-center" onMouseEnter={() => setCopyVisible(true)} onMouseLeave={() => setCopyVisible(false)}>
            {shouldIdent && <div style={{ minWidth: 25 }}></div>}
            <span className="text-primary">{keyword}</span>&nbsp;
            <span className="me-2">{stepName}</span>
            {copyVisible && <FontAwesomeIcon icon={faCopy} className="text-light" title={"Copy step definition"} onClick={() => copyToClipboard(step.definition.pattern)} />}
        </div>
        {step.outcome?.error && <pre>{step.outcome?.error}</pre>}
    </>
}