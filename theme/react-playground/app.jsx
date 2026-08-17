import React from "react";
import { createRoot } from "react-dom/client";
import { Sandpack } from "@codesandbox/sandpack-react";

function Playground({ code, onReady }) {
  React.useEffect(onReady, [onReady]);

  return (
    <Sandpack
      template="react"
      files={{ "/App.js": code }}
      options={{
        autorun: true,
        editorHeight: 360,
        showConsoleButton: true,
        showInlineErrors: true,
        showNavigator: false,
        showRefreshButton: true,
        showTabs: false
      }}
      theme="auto"
    />
  );
}

export function mountReactPlayground(element, code, onReady) {
  createRoot(element).render(
    <React.StrictMode>
      <Playground code={code} onReady={onReady} />
    </React.StrictMode>
  );
}
