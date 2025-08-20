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
import "./i18n.js";
import { GlobalStyles, StyledEngineProvider } from "@mui/material";
import Layout from "./components/Layout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import OAuthTestPage from "./pages/OAuthTestPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";

createRoot(document.getElementById("root")).render(
  <StyledEngineProvider enableCssLayer>
    <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/logincb/line"
          element={<SignUpPage provider={"line"} />}
        />
        <Route
          path="/logincb/kakao"
          element={<SignUpPage provider={"kakao"} />}
        />
        <Route
          path="/logincb/google"
          element={<SignUpPage provider={"google"} />}
        />
        <Route path="/oauthtest" element={<OAuthTestPage />} />
        <Route element={<Layout />}>
          <Route path="/test" element={<TestPage />} />
          <Route path="/choi" element={<ChoiPage />} />
          <Route path="/kim" element={<KimPage />} />
          <Route path="/lee" element={<LeePage />} />
          <Route path="/oh" element={<Oh />} />
          <Route path="/park" element={<ParkPage />} />
          <Route path="*" element={<h2>Page Not Found</h2>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StyledEngineProvider>
);
