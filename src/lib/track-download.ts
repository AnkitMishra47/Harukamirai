/**
 * Fire-and-forget download tracking via sendBeacon (or fetch fallback).
 * Called onClick of resume PDF links so the beacon fires before navigation.
 */
export function trackDownload(url: string) {
  const payload = JSON.stringify({
    event: "resume_download",
    url,
    timestamp: new Date().toISOString(),
    referrer: typeof document !== "undefined" ? document.referrer : "",
  });

  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    navigator.sendBeacon("/api/track", payload);
  } else if (typeof fetch !== "undefined") {
    fetch("/api/track", {
      method: "POST",
      body: payload,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    }).catch(() => {});
  }
}
