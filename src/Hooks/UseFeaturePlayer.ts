import * as React from "react";
import { postStep, getVariables, postVariables } from "../Data";
import { IFeature, IScenario, IStep, StepType, TestStatus } from "../Types";
import { useAsync } from "./UseAsync";

export type TFeaturePlayer = ReturnType<typeof useFeaturePlayer>;

export function useFeaturePlayer(feature: IFeature, setFeature: React.Dispatch<React.SetStateAction<IFeature>>) {
    const [currentScenarioId, setCurrentScenarioId] = React.useState<number>(null);
    const [currentStepId, setCurrentStepId] = React.useState<number>(null);
    const [isPlayingCurrentStep, setIsPlayingCurrentStep] = React.useState<boolean>(false);
    const [isPlayingCurrentScenario, setIsPlayingCurrentScenario] = React.useState<boolean>(false);
    const [isPlayingAll, setIsPlayingAll] = React.useState<boolean>(false);
    const [variables, setVariables] = React.useState<object>({});

    const getCurrentScenario = () => feature.scenarios.find(e => e.id === currentScenarioId);
    const setPageTitle = (icon: "⏸" | "⏯", scenarioName: string, stepName: string) => document.title = `${icon} ${scenarioName} - ${stepName}`;

    const reset = (clearStatus: boolean) => {
        pause();

        if (clearStatus) {
            const mapStep = (e: IStep): IStep => {
                const { outcome, ...step } = e;
                return step;
            }

            setFeature({
                ...feature,
                backgroundSteps: feature.backgroundSteps.map(mapStep),
                scenarios: feature.scenarios.map(e => ({
                    ...e,
                    steps: e.steps.map(mapStep)
                }))
            });

            updateVariables({});
        }

        const scenario = feature.scenarios[0];
        setCurrentScenarioId(scenario.id);

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
        const currentScenario = getCurrentScenario();

        if (step.nextStepId)
            setCurrentStepId(step.nextStepId);
        else
            if (step.type === StepType.Background)
                setCurrentStepId(currentScenario.steps[0].id);
            else {
                const nextScenario = feature.scenarios.find(e => e.id === currentScenario.nextScenarioId);
                if (nextScenario) {

                    if (isPlayingCurrentScenario) {
                        setIsPlayingCurrentScenario(false);
                        pause();
                        return;
                    }

                    setCurrentScenarioId(nextScenario.id);
                    if (feature.backgroundSteps?.length > 0)
                        setCurrentStepId(feature.backgroundSteps[0].id);
                    else
                        setCurrentStepId(nextScenario.steps[0].id);
                } else
                    pause();
            }
    }

    const runStep = async (stepId: number, autoAdvance?: boolean) => {
        const currentScenario = getCurrentScenario();
        const step = getStepById(stepId);

        if (step.breakpoint)
            return pause();

        const outcome = await postStep(currentScenario.id, stepId);

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

    React.useEffect(() => {
        if (feature?.scenarios?.length > 0) {
            const currentScenario = getCurrentScenario();
            const step = getStepById(currentStepId);
            const icon = (isPlayingCurrentStep || isPlayingCurrentScenario || isPlayingAll) ? "⏯" : "⏸";
            setPageTitle(icon, currentScenario.name, step.name);
        }
    }, [isPlayingCurrentStep, isPlayingCurrentScenario, isPlayingAll, currentStepId, currentScenarioId])

    const pause = () => {
        setIsPlayingAll(false);
        setIsPlayingCurrentScenario(false);
        setIsPlayingCurrentStep(false);
    }

    const updateVariables = async (newVariables: {}) => {
        const variables = await postVariables(newVariables);
        setVariables(variables);
    }

    return {
        variables,
        updateVariables,
        currentScenarioId,
        getCurrentScenario,
        setCurrentScenarioId,
        currentStepId,
        setCurrentStepId,
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