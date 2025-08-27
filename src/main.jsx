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
import BoardListPage from "./pages/BoardListPage.jsx";
import BoardArticleListPage from "./pages/BoardArticleListPage.jsx";
import BoardArticleViewPage from "./pages/BoardArticleViewPage.jsx";
import BoardWritePage from "./pages/BoardWritePage.jsx";
import MainPage from "./pages/MainPage.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import SysAdminUserPage from "./pages/SysAdminUserPage.jsx";
import SysAdminOrgPage from "./pages/SysAdminOrgPage.jsx";
import SysAdminBoardPage from "./pages/SysAdminBoardPage.jsx";
import SysAdminReviewPage from "./pages/SysAdminReviewPage.jsx";
import SysAdminPartyPage from "./pages/SysAdminPartyPage.jsx";
import SysAdminNoticePage from "./pages/SysAdminNoticePage.jsx";

createRoot(document.getElementById("root")).render(
  <StyledEngineProvider enableCssLayer>
    <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/logincb">
          <Route path="line" element={<SignUpPage provider={"line"} />} />
          <Route path="kakao" element={<SignUpPage provider={"kakao"} />} />
          <Route path="google" element={<SignUpPage provider={"google"} />} />
        </Route>
        <Route path="/oauthtest" element={<OAuthTestPage />} />
        <Route element={<Layout />}>
          <Route
            path="/sysadmin"
            element={<AdminLayout role={"systemAdmin"} />}
          >
            <Route path="user" element={<SysAdminUserPage />} />
            <Route path="org" element={<SysAdminOrgPage />} />
            <Route path="board" element={<SysAdminBoardPage />} />
            <Route path="review" element={<SysAdminReviewPage />} />
            <Route path="party" element={<SysAdminPartyPage />} />
            <Route path="notice" element={<SysAdminNoticePage />} />
          </Route>

          <Route path="/orgadmin" element={<AdminLayout role={"orgAdmin"} />}>
            <Route path="member" element={<SysAdminUserPage />} />
          </Route>
          <Route path="/hello" element={<MainPage />} />
          <Route path="/testauth" element={<AuthTestPage />} />
          <Route path="/board">
            <Route path="view/:articleId" element={<BoardArticleViewPage />} />
            <Route path="write" element={<BoardWritePage />} />
            <Route path="list" element={<BoardListPage />} />
            <Route path=":boardId" element={<BoardArticleListPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StyledEngineProvider>
);
