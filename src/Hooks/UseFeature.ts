import * as React from "react";
import { getFeature } from "../Data";
import { IFeature } from "../Types";
import { useAsync } from "./UseAsync";

export function useFeature() {
    const [feature, setFeature] = React.useState<IFeature>(null);

    const loading = useAsync(async () => {
        const feature = await getFeature();

        setFeature(feature);
    });

    return {
        loading,
        feature,
        setFeature
    };
}