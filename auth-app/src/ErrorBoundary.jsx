// src/ErrorBoundary.jsx
import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Algo salió mal
            </h2>

            {this.state.error && (
              <div className="mb-4">
                <p className="font-medium">Error:</p>
                <pre className="text-sm text-red-700 bg-red-100 p-2 rounded overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </div>
            )}

            {this.state.errorInfo?.componentStack && (
              <div>
                <p className="font-medium">Stack trace:</p>
                <pre className="text-xs text-gray-700 bg-gray-100 p-2 rounded overflow-auto h-40">
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}

            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              Recargar la aplicación
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
