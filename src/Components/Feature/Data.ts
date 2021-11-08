import { IFeature, IStepOutcome, TestStatus } from "./Types";

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

export async function postStep(scenarioId: number, stepId: number): Promise<IStepOutcome> {
    const res = await fetch(`/api/scenario/${scenarioId}/step/${stepId}`, {
        method: "POST"
    });

    const stepOutcome = await res.json();

    return stepOutcome;
}

export async function reloadScripts(): Promise<void> {
    await fetch("/api/reload", {
        method: "POST"
    });
}