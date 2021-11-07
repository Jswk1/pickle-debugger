import * as React from "react";

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends React.Component<any, ErrorBoundaryState> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error) {
        console.log(error);
    }

    render() {
        if (this.state.hasError)
            return <div className="alert alert-danger" role="alert">
                Error: {this.state.error.message}
            </div>

        return this.props.children;
    }
}