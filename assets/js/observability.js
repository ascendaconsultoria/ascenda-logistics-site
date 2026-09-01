(() => {
  const cfg = window.ASCENDA_CONFIG || {};
  const endpoint = cfg.OBSERVABILITY_ENDPOINT || "";
  const send = (type, payload) => {
    const data = {
      type,
      payload,
      ts: new Date().toISOString(),
      path: location.pathname,
      ua: navigator.userAgent,
    };
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: `ascenda_${type}`, ...payload });
    if (!endpoint) return;
    try {
      const body = JSON.stringify(data);
      if (navigator.sendBeacon)
        navigator.sendBeacon(
          endpoint,
          new Blob([body], { type: "application/json" }),
        );
      else
        fetch(endpoint, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => {});
    } catch (_) {}
  };
  window.addEventListener("error", (e) =>
    send("client_error", {
      message: e.message,
      source: e.filename,
      line: e.lineno,
      col: e.colno,
    }),
  );
  window.addEventListener("unhandledrejection", (e) =>
    send("unhandled_rejection", { message: String(e.reason) }),
  );

  // Real-user performance signals. Values are sent to dataLayer and optional endpoint.
  let cls = 0;
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries())
        if (!entry.hadRecentInput) cls += entry.value;
    }).observe({ type: "layout-shift", buffered: true });
  } catch (_) {}
  try {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lcp = entries[entries.length - 1];
      if (lcp)
        send("web_vital", { name: "LCP", value: Math.round(lcp.startTime) });
    }).observe({ type: "largest-contentful-paint", buffered: true });
  } catch (_) {}
  addEventListener(
    "visibilitychange",
    () => {
      if (document.visibilityState === "hidden")
        send("web_vital", { name: "CLS", value: Number(cls.toFixed(4)) });
    },
    { once: true },
  );
})();
