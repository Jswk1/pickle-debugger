import * as React from "react"
import { TFeaturePlayer } from "../../Hooks/UseFeaturePlayer"
import { IFeature, TestStatus } from "../../Types"

type TProgressType = "bg-success" | "bg-danger" | "bg-warning" | "bg-light";

export const Progress = (props: { feature: IFeature, player: TFeaturePlayer }) => {
    const { feature, player } = props;

    let total = 0;
    let progressBars: { type: TProgressType, count: number }[] = [];

    const addProgress = (type: "bg-success" | "bg-danger" | "bg-warning" | "bg-light") => {
        const pushNew = () => progressBars.push({ type, count: 1 });

        if (progressBars.length === 0)
            pushNew();
        else {
            const lastProgress = progressBars[progressBars.length - 1];

            if (lastProgress.type === type)
                lastProgress.count++;
            else
                pushNew();
        }
    }

    for (const scenario of feature.scenarios) {
        const steps = feature.backgroundSteps.concat(scenario.steps);
        for (const step of steps) {
            const { outcome } = step;

            total++;

            if (!outcome)
                addProgress("bg-light");
            else {
                switch (outcome.status) {
                    case TestStatus.Ok:
                        addProgress("bg-success"); break;
                    case TestStatus.Error:
                        addProgress("bg-danger"); break;
                    case TestStatus.Warning:
                        addProgress("bg-warning"); break;
                    case TestStatus.Skipped:
                        addProgress("bg-warning"); break;
                }
            }
        }
    }

    return <>
        <div className="progress">
            {progressBars.map((e, i) => {
                const percentage = (e.count * 100) / total;

                return <div key={i} className={`progress-bar progress-bar-striped ${player.isPlaying() ? "progress-bar-animated" : ""} ${e.type}`} role="progressbar" style={{ width: `${percentage}%` }}></div>;
            })}
        </div>
    </>
}