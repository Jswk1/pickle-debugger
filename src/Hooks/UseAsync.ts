import * as React from "react";

export const useAsync = (fn: (...args: any[]) => Promise<any>, deps: any[] = []) => {
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<Error>();

    React.useEffect(() => {
        let canFetch = true;

        if (canFetch)
            fn().catch(ex => setError(ex)).finally(() => setLoading(false));

        return () => { canFetch = false; };
    }, deps);

    if (error)
        throw error;

    return loading;
}