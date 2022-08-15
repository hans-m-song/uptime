import "antd/dist/antd.css";
import "./main.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { BrowserRouter } from "react-router-dom";
import { TargetsProvider } from "./contexts/targets";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <TargetsProvider>
        <App />
      </TargetsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
