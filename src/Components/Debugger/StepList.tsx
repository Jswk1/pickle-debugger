import { faArrowRight, faCircle, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { IStep, TestStatus } from "../../Types";
import { capitalize } from "../../Utils/Capitalize";
import "./StepList.scss";

export const StepList = (props: { steps: IStep[], currentStepId: number, title: string; onStepClick: (step: IStep) => void, onStepRightClick: (step: IStep) => void, onStepBreakpointClick: (step: IStep) => void }) => {
    const { steps, title, currentStepId, onStepClick, onStepRightClick, onStepBreakpointClick } = props;

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

        const handleStepRightClick = (ev: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
            ev.preventDefault();
            ev.stopPropagation();
            onStepRightClick(step);
        }

        return <tr key={step.id} step-id={step.id}>
            <td onClick={() => onStepBreakpointClick(step)} className="action">
                <span className={`${step.breakpoint ? "text-danger" : ""}`}><FontAwesomeIcon icon={faCircle} /></span>
            </td>
            <td className="icon-cell">
                {step.id === currentStepId && <FontAwesomeIcon icon={faArrowRight} />}
            </td>
            <td onClick={() => onStepClick(step)} onContextMenu={handleStepRightClick} className={"w-100 action " + getRowColor()}>
                <Step step={step} />
            </td>
        </tr>
    }

    return <>
        <table className="table w-auto table-dark table-sm table-bordered table-striped table-hover caption-top">
            <caption className="text-light">{title}</caption>
            <tbody>
                {steps.map(getStep)}
            </tbody>
        </table>
    </>
}

export function colorizeStep(step: IStep) {
    const matches = step.definition.expression.regexp.exec(step.name);
    let content = step.name;

    for (let i = 1; i < matches.length; i++) {
        const match = matches[i];
        if (!match)
            break;

        content = content.replace(match, `<span class="highlight">${match}</span>`);
    }

    return content;
}

const Step = (props: { step: IStep }) => {
    const { step } = props;
    const shouldIdent = step.keyword.toLowerCase() === "and";

    colorizeStep(step);

    return <>
        <div className="d-flex align-items-center" >
            {shouldIdent && <div className="icon-cell"></div>}
            <span className="text-primary">{capitalize(step.keyword)}</span>&nbsp;
            <span className="me-2" dangerouslySetInnerHTML={{ __html: colorizeStep(step) }}></span>
        </div>
        {step.outcome?.error && <pre>{step.outcome?.error}</pre>}
    </>
}