import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "../style.css"; // Import global styles
import "weather-icons/css/weather-icons.css";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
