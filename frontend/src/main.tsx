import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div style={{ marginLeft: '10%', marginRight: '10%', marginTop: '40px' }}>
    <App />

    </div>
  </StrictMode>,
);
