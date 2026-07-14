import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Admin crashed:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-cream p-6">
          <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-sm ring-1 ring-ink/5">
            <h1 className="font-display text-xl font-700 text-ink">Something went wrong</h1>
            <p className="mt-2 text-sm text-ink/60">
              The admin panel hit an unexpected error. The details below will help fix it.
            </p>
            <pre className="mt-4 max-h-64 overflow-auto rounded-2xl bg-ink/5 p-4 text-xs text-ink/70">
              {String(this.state.error?.stack || this.state.error)}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="focus-ring mt-4 rounded-full bg-ink px-5 py-2.5 text-sm font-600 text-cream"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
