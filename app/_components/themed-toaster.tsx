"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";

type Theme = "light" | "dark";

function readTheme(): Theme {
  if (typeof document === "undefined") {
    return "light";
  }
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

export function ThemedToaster() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(readTheme());

    const observer = new MutationObserver(() => setTheme(readTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Toaster
      duration={4000}
      gap={10}
      offset={24}
      position="bottom-right"
      theme={theme}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "custom-toast",
          title: "custom-toast-title",
          description: "custom-toast-description",
          icon: "custom-toast-icon",
          actionButton: "custom-toast-action",
          cancelButton: "custom-toast-cancel",
          closeButton: "custom-toast-close",
        },
      }}
      visibleToasts={4}
    />
  );
}
