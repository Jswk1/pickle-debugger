import * as React from "react";
import { postStep, getVariables } from "../Data";
import { IFeature, IScenario, StepType, TestStatus } from "../Types";
import { useAsync } from "./UseAsync";

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

        pause();

        if (clearStatus) {
            for (const step of feature.backgroundSteps)
                delete step.outcome;

            for (const scenario of feature.scenarios)
                for (const step of scenario.steps)
                    delete step.outcome;
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

        const setNextStep = (stepId: number) => {
            setCurrentStepId(stepId);

            const nextStep = getStepById(stepId);
            if (nextStep.breakpoint)
                pause();
        }

        if (step.nextStepId)
            setNextStep(step.nextStepId);
        else
            if (step.type === StepType.Background)
                setNextStep(currentScenario.steps[0].id);
            else {
                const nextScenario = feature.scenarios.find(e => e.id === currentScenario.nextScenarioId);
                if (nextScenario) {

                    if (isPlayingCurrentScenario) {
                        setIsPlayingCurrentScenario(false);
                        pause();
                        return;
                    }

                    setCurrentScenario(nextScenario);
                    if (feature.backgroundSteps?.length > 0)
                        setNextStep(feature.backgroundSteps[0].id);
                    else
                        setNextStep(nextScenario.steps[0].id);
                } else
                    pause();
            }
    }

    const runStep = async (stepId: number, autoAdvance?: boolean) => {
        const outcome = await postStep(currentScenario.id, stepId);
        const step = getStepById(stepId);

        step.outcome = outcome;

        if (isPlayingCurrentStep)
            setIsPlayingCurrentStep(false);

        if (outcome.status === TestStatus.Error)
            pause();
        else
            if (autoAdvance)
                advance();

        return outcome;
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

    const pause = () => {
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
        pause
    };
}