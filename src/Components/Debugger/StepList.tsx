import { faArrowRight, faCircle, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { IStep, TestStatus } from "../../Types";
import { capitalize } from "../../Utils/Capitalize";
import { copyToClipboard } from "../../Utils/Clipboard";
import "./StepList.scss";

export const StepList = (props: { steps: IStep[], currentStepId: number, title: string; onStepClick: (step: IStep) => void, onStepBreakpointClick: (step: IStep) => void }) => {
    const { steps, title, currentStepId, onStepClick, onStepBreakpointClick } = props;

    React.useLayoutEffect(() => {
        const el = document.querySelector(`[step-id="${currentStepId}"]`);
        if (el)
            el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, [currentStepId]);

    const getStep = (step: IStep) => {
        const getRowColor = () => {
            switch (step.outcome?.status) {
                case TestStatus.Ok: return "text-success";
                case TestStatus.Error: return "text-danger";
                case TestStatus.Skipped: return "text-warning";
                default: return "";
            }
        }

        return <tr key={step.id} step-id={step.id}>
            <td onClick={() => onStepBreakpointClick(step)} className="action">
                <span className={`${step.breakpoint ? "text-danger" : ""}`}><FontAwesomeIcon icon={faCircle} /></span>
            </td>
            <td className="icon-cell">
                {step.id === currentStepId && <FontAwesomeIcon icon={faArrowRight} />}
            </td>
            <td onClick={() => onStepClick(step)} className={"w-100 action " + getRowColor()}>
                <Step step={step} />
            </td>
        </tr>
    }

    return <>
        <table className="table w-auto table-dark table-sm table-bordered table-striped table-hover caption-top">
            <caption>{title}</caption>
            <tbody>
                {steps.map(getStep)}
            </tbody>
        </table>
    </>
}

const Step = (props: { step: IStep }) => {
    const { step } = props;

    const [copyVisible, setCopyVisible] = React.useState(false);
    const shouldIdent = step.keyword.toLowerCase() === "and";

    return <>
        <div className="d-flex align-items-center" onMouseEnter={() => setCopyVisible(true)} onMouseLeave={() => setCopyVisible(false)}>
            {shouldIdent && <div className="icon-cell"></div>}
            <span className="text-primary">{capitalize(step.keyword)}</span>&nbsp;
            <span className="me-2">{step.name}</span>
            {copyVisible && <FontAwesomeIcon icon={faCopy} className="text-light" title={"Copy step definition"} onClick={() => copyToClipboard(step.definition.pattern)} />}
        </div>
        {step.outcome?.error && <pre>{step.outcome?.error}</pre>}
    </>
}