import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router";
import "./i18n.js";
import { GlobalStyles, StyledEngineProvider } from "@mui/material";
import Layout from "./components/Layout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import OAuthTestPage from "./pages/OAuthTestPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LanguageSelector from "./components/LanguageSelector.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import AuthTestPage from "./pages/AuthTestPage.jsx";

createRoot(document.getElementById("root")).render(
  <StyledEngineProvider enableCssLayer>
    <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/logincb">
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
        </Route>
        <Route path="/oauthtest" element={<OAuthTestPage />} />
        <Route element={<Layout />}>
          <Route path="/hello" element={<h1>hello</h1>} />
          <Route path="/testauth" element={<AuthTestPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StyledEngineProvider>
);
