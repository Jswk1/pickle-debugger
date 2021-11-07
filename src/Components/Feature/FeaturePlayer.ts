import * as React from "react";
import { useAsync } from "../../Hooks/UseAsync";
import { getFeature, getVariables, postStep } from "./Data";
import { IFeature, IScenario, IStep, StepType, TestStatus } from "./Types";

export function useFeature() {
    const [feature, setFeature] = React.useState<IFeature>(null);
    const [variables, setVariables] = React.useState<object>({});

    const loading = useAsync(async () => {
        const feature = await getFeature();
        const variables = await getVariables();

        setVariables(variables);
        setFeature(feature);
    });

    return {
        loading,
        feature,
        variables
    };
}

export type TFeaturePlayer = ReturnType<typeof useFeaturePlayer>;

export function useFeaturePlayer(feature: IFeature) {
    const [currentScenario, setCurrentScenario] = React.useState<IScenario>(null);
    const [currentStepId, setCurrentStepId] = React.useState<number>(null);

    const reset = () => {
        if (!feature)
            return;

        const scenario = feature.scenarios[0];
        setCurrentScenario(scenario);

        if (feature.backgroundSteps?.length > 0)
            setCurrentStepId(feature.backgroundSteps[0].id);
        else if (scenario.steps?.length > 0)
            setCurrentStepId(scenario.steps[0].id);
        else
            setCurrentStepId(null);
    }

    const getStepById = (stepId: number) => {
        for (const bgStep of feature.backgroundSteps) {
            if (bgStep.id === stepId)
                return bgStep;
        }

        for (const scenario of feature.scenarios) {
            for (const step of scenario.steps)
                if (step.id === stepId)
                    return step;
        }

        throw new Error(`Step could not be found. Id = ${stepId}.`);
    }

    const advance = () => {
        const step = getStepById(currentStepId);

        if (step.nextStepId)
            setCurrentStepId(step.nextStepId);
        else
            if (step.type === StepType.Background)
                setCurrentStepId(currentScenario.steps[0].id);
            else {
                const nextScenario = feature.scenarios.find(e => e.id === currentScenario.nextScenarioId);
                if (nextScenario) {
                    setCurrentScenario(nextScenario);
                    if (feature.backgroundSteps?.length > 0)
                        setCurrentStepId(feature.backgroundSteps[0].id);
                    else
                        setCurrentStepId(nextScenario.steps[0].id);
                }
            }
    }

    const runStep = async (stepId: number, autoAdvance?: boolean) => {
        const status = await postStep(currentScenario.id, stepId);

        if (autoAdvance)
            advance();

        return status;
    }

    return {
        currentScenario,
        currentStepId,
        setCurrentStepId,
        setCurrentScenario,
        runStep,
        reset
    };
}