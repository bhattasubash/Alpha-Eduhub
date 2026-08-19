"use client";

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white">
          <div className="text-center max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-gray-400 mb-4">An error occurred while rendering this component. The rest of the application should still work.</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Try again
            </button>
            <p className="text-gray-500 text-sm mt-4">
              Error: {this.state.error?.message || 'Unknown error'}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}