import * as React from "react";

export const Variables = (props: { variables: { [key: string]: any } }) => {
    const { variables } = props;

    return <>
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