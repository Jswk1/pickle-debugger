export interface IFeature {
    name: string;
    scenarios: IScenario[];
}

export interface IScenario {
    name: string;
    steps: IStep[];
}

export enum StepType {
    Background = 1,
    Scenario = 2
}

export enum Status {
    Ok = 1,
    Warning = 2,
    Error = 4,
    Skipped = 8
}

export interface IStep {
    id: number;
    name: string;
    type: StepType;
    lastStatus: Status;
}