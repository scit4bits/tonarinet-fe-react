import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router";
import TestPage from "./pages/TestPage.jsx";
import ChoiPage from "./pages/ChoiPage.jsx";
import KimPage from "./pages/KimPage.jsx";
import LeePage from "./pages/LeePage.jsx";
import Oh from "./pages/Oh.jsx";
import ParkPage from "./pages/ParkPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/choi" element={<ChoiPage />} />
        <Route path="/kim" element={<KimPage />} />
        <Route path="/lee" element={<LeePage />} />
        <Route path="/oh" element={<Oh />} />
        <Route path="/park" element={<ParkPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
