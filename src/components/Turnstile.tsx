import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        'expired-callback'?: () => void;
        'error-callback'?: () => void;
      }) => string;
      reset: (widgetId: string) => void;
    };
  }
}

interface TurnstileProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  siteKey: string;
  className?: string;
}

export function Turnstile({ onVerify, onExpire, onError, siteKey, className }: TurnstileProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const widgetId = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the Turnstile script
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Clean up the script and widget
      document.body.removeChild(script);
      if (widgetId.current) {
        window.turnstile?.reset(widgetId.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !containerRef.current) return;

    // Render the Turnstile widget
    const widget = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      callback: onVerify,
      'expired-callback': onExpire,
      'error-callback': onError,
    });

    widgetId.current = widget;

    return () => {
      if (widgetId.current) {
        window.turnstile?.reset(widgetId.current);
      }
    };
  }, [isLoaded, onVerify, onExpire, onError, siteKey]);

  return <div ref={containerRef} className={className} />;
}
