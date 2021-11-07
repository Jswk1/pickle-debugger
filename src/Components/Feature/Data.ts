import { IFeature, Status } from "./Types";

export async function getFeature(): Promise<IFeature> {
    const res = await fetch("/api/feature");
    const feature = await res.json();

    return feature;
}

export async function getVariables(): Promise<object> {
    const res = await fetch("/api/feature/variables");
    const variables = await res.json();

    return variables;
}

export async function runStep(stepId: number): Promise<Status> {
    const res = await fetch("/api/step/" + stepId, {
        method: "POST"
    })
    const stepOutcome: { status: Status } = await res.json();

    return stepOutcome.status;
}