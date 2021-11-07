import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { IScenario } from "./Types";

export const Scenario = (props: { scenario: IScenario, currentId: number, setCurrent: (currentId: number) => void }) => {
    const { scenario, currentId, setCurrent } = props;

    return <>
        <table className="table table-dark table-sm table-bordered table-striped table-hover caption-top">
            <caption>{scenario.name}</caption>
            <tbody>
                {scenario.steps.map((step, i) => {
                    const isCurrent = currentId === step.id;
                    const textColor = isCurrent ? "text-primary" : "";

                    return <tr key={i} onClick={() => setCurrent(step.id)} >
                        <td className={textColor} style={{ maxWidth: "10px", textAlign: "center" }}>{isCurrent ? <FontAwesomeIcon icon={faArrowRight} /> : null}</td>
                        <td className={textColor}>{step.name}</td>
                    </tr>
                })}
            </tbody>
        </table>
    </>
}