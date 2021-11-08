export interface IFeature {
    name: string;
    backgroundSteps: IStep[];
    scenarios: IScenario[];
}

export interface IScenario {
    id: number;
    name: string;
    steps: IStep[];

    nextScenarioId?: number;
}

export enum StepType {
    Background = 1,
    Scenario = 2
}

export enum TestStatus {
    Ok = 1,
    Warning = 2,
    Error = 4,
    Skipped = 8
}

export interface IStepOutcome {
    status: TestStatus;
    error?: string;
}

export interface IStep {
    id: number;
    name: string;
    type: StepType;

    outcome?: IStepOutcome;

    breakpoint?: boolean;
    nextStepId?: number;
}