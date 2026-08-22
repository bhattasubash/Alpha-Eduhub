import React, { ComponentType } from 'react';

export function safeDynamicImport<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: ComponentType<any>,
  fallbackMessage: string = "Loading..."
): ComponentType<any> {
  return React.lazy(() => 
    importFn().catch((error) => {
      console.error(`Failed to load component: ${fallbackMessage}`, error);
      return {
        default: fallback || (() => React.createElement("div", { className: "p-4 text-center text-gray-500" }, fallbackMessage))
      };
    })
  );
}

export function withFallback<T extends object>(
  Component: ComponentType<T>,
  FallbackComponent?: ComponentType<any>
) {
  return function SafeComponent(props: T) {
    try {
      return React.createElement(Component, props);
    } catch (error) {
      console.error('Component error:', error);
      return FallbackComponent 
        ? React.createElement(FallbackComponent, null) 
        : React.createElement("div", { className: "p-4 text-center text-red-500" }, "Component temporarily unavailable");
    }
  };
}