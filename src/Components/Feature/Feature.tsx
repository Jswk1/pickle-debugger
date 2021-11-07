import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { useAsync } from "../../Hooks/UseAsync";
import { getFeature, getVariables } from "./Data";
import { Scenario } from "./Scenario";
import { IFeature } from "./Types";

export const FeatureViewer = () => {
    const [feature, setFeature] = React.useState<IFeature>(null);
    const [variables, setVariables] = React.useState<object>({});
    const [currentId, setCurrentId] = React.useState<number>(null);

    const { loading } = useAsync(async () => {
        const feature = await getFeature();
        const variables = await getVariables();

        setVariables(variables);
        setFeature(feature);
    });

    const runStep = async () => {
        const stepId = currentId;
        setCurrentId(stepId + 1);

        const res = await fetch("/api/step/" + stepId, {
            method: "POST"
        });

        const status = await res.json();

        const variables = await getVariables();
        setVariables(variables);

        return status;
    }

    if (loading)
        return <div>Loading...</div>

    return <>
        <div className="container-fluid">
            <div className="row">
                <div className="col-2">
                    <h3>Variables</h3>
                    <div>
                        {JSON.stringify(variables)}
                    </div>
                </div>
                <div className="col">
                    <h3>{feature.name} <small className="text-muted">Feature</small> </h3>
                    {feature.scenarios.map((e, i) => <Scenario key={i} scenario={e} currentId={currentId} setCurrent={setCurrentId} />)}
                </div>
            </div>
            <button className="btn btn-primary" onClick={() => runStep()}><FontAwesomeIcon icon={faPlay} /></button>
        </div>
    </>

}