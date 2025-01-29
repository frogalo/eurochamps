import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "./context/UserContext"; // Import the UserProvider
import "./styles/App.css";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <UserProvider>
            <App />
        </UserProvider>
    </React.StrictMode>
);
