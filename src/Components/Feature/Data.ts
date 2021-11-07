import { IFeature, TestStatus } from "./Types";

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

export async function postStep(scenarioId: number, stepId: number): Promise<TestStatus> {
    const res = await fetch(`/api/scenario/${scenarioId}/step/${stepId}`, {
        method: "POST"
    });

    const stepOutcome: { status: TestStatus } = await res.json();

    return stepOutcome.status;
}