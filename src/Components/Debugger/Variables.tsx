import { faSave, faUpload } from "@fortawesome/free-solid-svg-icons";
import * as React from "react";
import { loadFile, saveFile } from "../../Utils/File";
import { Button } from "../UI/Button";

export const Variables = (props: { variables: { [key: string]: any }, updateVariables: (newVariables: {}) => Promise<void> }) => {
    const { variables } = props;

    const updateVariables = async (content: string) => {
        const obj = JSON.parse(content);
        await props.updateVariables(obj);
    }

    return <>
        <div className="mb-2">
            <Button class="btn-light" icon={faSave} onClick={() => saveFile(JSON.stringify(variables), "variables.json", "application/json")}>Save</Button>
            <Button class="btn-light" icon={faUpload} onClick={() => loadFile(updateVariables)}>Load</Button>
        </div>
        <table className="table table-dark table-sm table-bordered table-striped table-hover caption-top">
            <tbody>
                {Object.keys(variables).map(k => {

                    return <tr key={k}>
                        <td>{k}</td>
                        <td>{JSON.stringify(variables[k])}</td>
                    </tr>
                })}
            </tbody>
        </table>
    </>
}