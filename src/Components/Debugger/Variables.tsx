import { faSave, faUpload } from "@fortawesome/free-solid-svg-icons";
import * as React from "react";
import { usePrevious } from "../../Hooks/UsePrevious";
import { TVariables } from "../../Types";
import { loadFile, saveFile } from "../../Utils/File";
import { Button } from "../UI/Button";

export const Variables = (props: { variables: TVariables, updateVariables: (newVariables: TVariables) => Promise<void> }) => {
    const { variables } = props;
    const previousVariables = usePrevious(variables);
    const [changedKeys, setChangedKeys] = React.useState<string[]>([]);

    const updateVariables = async (content: string) => {
        const obj = JSON.parse(content);
        await props.updateVariables(obj);
    }

    React.useEffect(() => {
        if (!previousVariables) {
            setChangedKeys(Object.keys(variables));
        } else {
            const newChangedKeys: string[] = [];
            for (const key in variables) {
                if (!previousVariables[key])
                    newChangedKeys.push(key);
                else {
                    const value = JSON.stringify(variables[key]);
                    const oldValue = JSON.stringify(previousVariables[key]);

                    if (value !== oldValue)
                        newChangedKeys.push(key);
                }
            }

            setChangedKeys(newChangedKeys);
        }
    }, [variables]);

    return <>
        <div className="mb-2">
            <Button class="btn-light" icon={faSave} onClick={() => saveFile(JSON.stringify(variables), "variables.json", "application/json")}>Save</Button>
            <Button class="btn-light" icon={faUpload} onClick={() => loadFile(updateVariables)}>Load</Button>
        </div>
        <div className="flex-grow-1 overflow-auto">
            <table className="table w-auto table-dark table-sm table-bordered table-striped table-hover caption-top">
                <thead>
                    <tr>
                        <th>Key</th>
                        <th className="w-100">Value</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(variables).map(k => {
                        return <tr key={k}>
                            <td className={changedKeys.includes(k) ? "text-success" : ""}>{k}</td>
                            <td className="w-100"><pre className="mb-0">{typeof variables[k] === "object" ? JSON.stringify(variables[k], undefined, 2) : variables[k]}</pre></td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>

    </>
}