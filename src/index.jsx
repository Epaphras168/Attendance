import './index.css';
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // default import from App.jsx
import AuthProvider from './contexts/AuthContext';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AuthProvider>
  <App />
</AuthProvider>
);
