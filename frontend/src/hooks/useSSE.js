import { useEffect, useRef } from 'react';

export function useSSE(onMessage) {
  const eventSourceRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // EventSource doesn't support custom headers, so the token goes as a query param.
    // This means the backend needs to also accept the token via query param on this
    // one endpoint — a deliberate, narrow exception to "always use the header."
    const url = `http://localhost:8081/api/sse/subscribe?token=${token}`;
    const eventSource = new EventSource(url);

    eventSource.addEventListener('booking-update', (event) => {
      onMessage(JSON.parse(event.data));
    });

    eventSource.onerror = () => {
      eventSource.close();
    };

    eventSourceRef.current = eventSource;

    return () => {
      eventSource.close();
    };
  }, [onMessage]);
}