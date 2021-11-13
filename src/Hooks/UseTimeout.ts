import * as React from "react";

export function useTimeout(callback: () => void, timeoutMs: number) {
    React.useEffect(() => {
        const timeout = setTimeout(callback, timeoutMs);

        return () => {
            clearTimeout(timeout);
        }
    }, []);
}