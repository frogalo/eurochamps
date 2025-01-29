import React from "react";
import ReactDOM from "react-dom/client"; // Use the new ReactDOM client
import App from "./App";
import "./styles/App.css"; // Import global styles here
// Get the root element from the DOM
const rootElement = document.getElementById("root");

// Create a root and render the App component
const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);
