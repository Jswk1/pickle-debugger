import { IFeature, IStepOutcome, TestStatus, TVariables } from "./Types";

export async function getFeature(): Promise<IFeature> {
    const res = await fetch("/api/feature");
    const json = await res.text();

    const feature = JSON.parse(json, (k, v) => {
        const m = /__REGEXP(.*)/.exec(v);
        if (m?.length > 0)
            return new RegExp(m[1]);

        return v;
    });

    console.log("@feature", feature);
    return feature;
}

export async function getVariables(): Promise<TVariables> {
    const res = await fetch("/api/feature/variables");
    const variables = await res.json();

    return variables;
}

export async function postVariables(newVariables: {}): Promise<TVariables> {
    const res = await fetch("/api/feature/variables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variables: newVariables })
    });

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