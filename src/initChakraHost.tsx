import React from "react";
import { createRoot } from "react-dom/client";
import PortalHost, { registry } from "./PortalHost";

export function initChakraHost() {
  if ((window as any).__chakraWCHost) {
    return (window as any).__chakraWCHost;
  }

  const mountPoint = document.createElement("div");
  mountPoint.id = "chakra-wc-portal-host";
  mountPoint.style.display = "none";
  document.body.appendChild(mountPoint);

  const root = createRoot(mountPoint);
  root.render(<PortalHost />);

  (window as any).__chakraWCHost = registry;

  console.log("[ChakraWC] Portal host initialized");

  return registry;
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChakraHost);
  } else {
    initChakraHost();
  }
}
