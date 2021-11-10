import { faSave, faUpload } from "@fortawesome/free-solid-svg-icons";
import * as React from "react";
import { Button } from "../UI/Button";

export const Variables = (props: { variables: { [key: string]: any } }) => {
    const { variables } = props;

    return <>
        <div className="mb-2">
            <Button class="btn-light" icon={faSave} >Save</Button>
            <Button class="btn-light" icon={faUpload}>Load</Button>
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