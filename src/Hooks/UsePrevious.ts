import * as React from "react";
import { useRef } from "react";

export function usePrevious<T>(value: T) {
    const ref = useRef<T>();

    React.useEffect(() => {
        ref.current = value;
    });

    return ref.current;
}