// Performance monitoring and optimization utilities
import React from 'react';
import { logger } from './logger';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count';
  timestamp: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];

  private constructor() {
    this.initializeObservers();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeObservers() {
    if (typeof window === 'undefined') return;

    // Observe navigation timing
    if ('PerformanceObserver' in window) {
      try {
        const navObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'navigation') {
              const navEntry = entry as PerformanceNavigationTiming;
              this.recordMetric('page_load_time', navEntry.loadEventEnd - navEntry.fetchStart, 'ms');
              this.recordMetric('dom_content_loaded', navEntry.domContentLoadedEventEnd - navEntry.fetchStart, 'ms');
              this.recordMetric('first_paint', navEntry.responseEnd - navEntry.fetchStart, 'ms');
            }
          });
        });
        navObserver.observe({ entryTypes: ['navigation'] });
        this.observers.push(navObserver);
      } catch (error) {
        logger.warn('Failed to initialize navigation observer', error, 'PerformanceMonitor');
      }

      // Observe resource timing
      try {
        const resourceObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'resource') {
              const resourceEntry = entry as PerformanceResourceTiming;
              if (resourceEntry.name.includes('/api/')) {
                this.recordMetric(
                  'api_request_time',
                  resourceEntry.responseEnd - resourceEntry.requestStart,
                  'ms',
                  { url: resourceEntry.name }
                );
              }
            }
          });
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.push(resourceObserver);
      } catch (error) {
        logger.warn('Failed to initialize resource observer', error, 'PerformanceMonitor');
      }

      // Observe largest contentful paint
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.recordMetric('largest_contentful_paint', lastEntry.startTime, 'ms');
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (error) {
        logger.warn('Failed to initialize LCP observer', error, 'PerformanceMonitor');
      }
    }
  }

  public recordMetric(name: string, value: number, unit: 'ms' | 'bytes' | 'count', metadata?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      metadata
    };

    this.metrics.push(metric);
    
    // Keep only last 100 metrics to prevent memory leaks
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    logger.debug(`Performance metric recorded: ${name}`, metric, 'PerformanceMonitor');
  }

  public getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter(metric => metric.name === name);
    }
    return [...this.metrics];
  }

  public getAverageMetric(name: string): number | null {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return null;
    
    const sum = metrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / metrics.length;
  }

  public clearMetrics() {
    this.metrics = [];
  }

  public destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.clearMetrics();
  }
}

// Timing utilities
export const measureTime = async <T>(
  name: string,
  fn: () => Promise<T> | T,
  metadata?: Record<string, any>
): Promise<T> => {
  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    PerformanceMonitor.getInstance().recordMetric(name, duration, 'ms', metadata);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    PerformanceMonitor.getInstance().recordMetric(`${name}_error`, duration, 'ms', { ...metadata, error: true });
    throw error;
  }
};

export const measureSync = <T>(
  name: string,
  fn: () => T,
  metadata?: Record<string, any>
): T => {
  const start = performance.now();
  try {
    const result = fn();
    const duration = performance.now() - start;
    PerformanceMonitor.getInstance().recordMetric(name, duration, 'ms', metadata);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    PerformanceMonitor.getInstance().recordMetric(`${name}_error`, duration, 'ms', { ...metadata, error: true });
    throw error;
  }
};

// Memory utilities
export const measureMemoryUsage = (name: string, metadata?: Record<string, any>) => {
  if (typeof window !== 'undefined' && 'memory' in performance) {
    const memory = (performance as any).memory;
    PerformanceMonitor.getInstance().recordMetric(
      `${name}_memory_used`,
      memory.usedJSHeapSize,
      'bytes',
      metadata
    );
    PerformanceMonitor.getInstance().recordMetric(
      `${name}_memory_total`,
      memory.totalJSHeapSize,
      'bytes',
      metadata
    );
  }
};

// Bundle size tracking
export const trackBundleSize = (chunkName: string, size: number) => {
  PerformanceMonitor.getInstance().recordMetric(
    'bundle_size',
    size,
    'bytes',
    { chunk: chunkName }
  );
};

// React component performance
export const withPerformanceTracking = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  return React.memo((props: P) => {
    const renderStart = React.useRef<number | undefined>(undefined);
    
    React.useLayoutEffect(() => {
      renderStart.current = performance.now();
    });

    React.useEffect(() => {
      if (renderStart.current) {
        const renderTime = performance.now() - renderStart.current;
        PerformanceMonitor.getInstance().recordMetric(
          'component_render_time',
          renderTime,
          'ms',
          { component: componentName }
        );
      }
    });

    return React.createElement(Component, props);
  });
};

// Hook for performance tracking
export const usePerformanceTracking = (componentName: string) => {
  const renderCount = React.useRef(0);
  const mountTime = React.useRef<number | undefined>(undefined);

  React.useEffect(() => {
    mountTime.current = performance.now();
    return () => {
      if (mountTime.current) {
        const lifeTime = performance.now() - mountTime.current;
        PerformanceMonitor.getInstance().recordMetric(
          'component_lifetime',
          lifeTime,
          'ms',
          { component: componentName, renderCount: renderCount.current }
        );
      }
    };
  }, [componentName]);

  React.useEffect(() => {
    renderCount.current++;
    PerformanceMonitor.getInstance().recordMetric(
      'component_render_count',
      renderCount.current,
      'count',
      { component: componentName }
    );
  });

  return {
    recordMetric: (name: string, value: number, unit: 'ms' | 'bytes' | 'count', metadata?: Record<string, any>) => {
      PerformanceMonitor.getInstance().recordMetric(name, value, unit, { component: componentName, ...metadata });
    }
  };
};

// Image loading performance
export const trackImageLoad = (src: string, loadTime: number) => {
  PerformanceMonitor.getInstance().recordMetric(
    'image_load_time',
    loadTime,
    'ms',
    { src }
  );
};

// API call performance wrapper
export const withApiPerformanceTracking = <T extends (...args: any[]) => Promise<any>>(
  apiFunction: T,
  apiName: string
): T => {
  return (async (...args: Parameters<T>) => {
    return measureTime(
      `api_${apiName}`,
      () => apiFunction(...args),
      { endpoint: apiName, args: args.length }
    );
  }) as T;
};

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Cleanup function for app unmount
export const cleanupPerformanceMonitoring = () => {
  performanceMonitor.destroy();
};