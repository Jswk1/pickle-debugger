import * as React from "react";
import { useAsync } from "../../Hooks/UseAsync";
import { getFeature, getVariables, postStep } from "./Data";
import { IFeature, IScenario, IStep, StepType, TestStatus } from "./Types";

export function useFeature() {
    const [feature, setFeature] = React.useState<IFeature>(null);

    const loading = useAsync(async () => {
        const feature = await getFeature();

        setFeature(feature);
    });

    return {
        loading,
        feature
    };
}

export type TFeaturePlayer = ReturnType<typeof useFeaturePlayer>;

export function useFeaturePlayer(feature: IFeature) {
    const [currentScenario, setCurrentScenario] = React.useState<IScenario>(null);
    const [currentStepId, setCurrentStepId] = React.useState<number>(null);
    const [isPlayingCurrentStep, setIsPlayingCurrentStep] = React.useState<boolean>(false);
    const [isPlayingCurrentScenario, setIsPlayingCurrentScenario] = React.useState<boolean>(false);
    const [isPlayingAll, setIsPlayingAll] = React.useState<boolean>(false);
    const [variables, setVariables] = React.useState<object>({});

    const reset = (clearStatus: boolean) => {
        if (!feature)
            return;

        stop();

        if (clearStatus) {
            for (const step of feature.backgroundSteps)
                step.lastStatus = undefined;

            for (const scenario of feature.scenarios)
                for (const step of scenario.steps)
                    step.lastStatus = undefined;
        }

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

                    if (isPlayingCurrentScenario)
                        setIsPlayingCurrentScenario(false);

                    setCurrentScenario(nextScenario);
                    if (feature.backgroundSteps?.length > 0)
                        setCurrentStepId(feature.backgroundSteps[0].id);
                    else
                        setCurrentStepId(nextScenario.steps[0].id);
                } else {
                    reset(false);
                }
            }

    }

    const runStep = async (stepId: number, autoAdvance?: boolean) => {
        const status = await postStep(currentScenario.id, stepId);
        const step = getStepById(stepId);
        step.lastStatus = status;

        if (isPlayingCurrentStep)
            setIsPlayingCurrentStep(false);

        if (status === TestStatus.Error)
            stop();

        if (autoAdvance)
            advance();

        return status;
    }

    useAsync(async () => {
        const variables = await getVariables();
        setVariables(variables);
    }, [currentStepId]);

    React.useEffect(() => {
        let canPlay = true;

        if (canPlay && (isPlayingCurrentStep || isPlayingCurrentScenario || isPlayingAll))
            runStep(currentStepId, true);

        return () => { canPlay = false; }
    }, [isPlayingCurrentStep, isPlayingCurrentScenario, isPlayingAll, currentStepId]);

    const stop = () => {
        setIsPlayingAll(false);
        setIsPlayingCurrentScenario(false);
        setIsPlayingCurrentStep(false);
    }

    return {
        variables,
        currentScenario,
        currentStepId,
        setCurrentStepId,
        setCurrentScenario,
        isPlayingCurrentStep,
        setIsPlayingCurrentStep,
        isPlayingAll,
        setIsPlayingAll,
        isPlayingCurrentScenario,
        setIsPlayingCurrentScenario,
        runStep,
        reset,
        stop
    };
}