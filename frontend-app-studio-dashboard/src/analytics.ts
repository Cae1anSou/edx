type AnalyticsLike = {
  track: (event: string, payload: Record<string, unknown>) => void;
};

export function trackEvent(event: string, payload: Record<string, unknown>) {
  const analytics = (window as Window & { analytics?: AnalyticsLike }).analytics;
  if (analytics && typeof analytics.track === 'function') {
    analytics.track(event, payload);
  }
}
