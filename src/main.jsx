import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router";
import "./i18n.js";
import { GlobalStyles, StyledEngineProvider } from "@mui/material";
import Layout from "./components/Layout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import SignUpPage from "./pages/auth/SignUpPage.jsx";
import LanguageSelector from "./components/LanguageSelector.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import SignInPage from "./pages/auth/SignInPage.jsx";
import AuthTestPage from "./pages/auth/AuthTestPage.jsx";
import BoardListPage from "./pages/board/BoardListPage.jsx";
import BoardArticleListPage from "./pages/board/BoardArticleListPage.jsx";
import BoardArticleViewPage from "./pages/board/BoardArticleViewPage.jsx";
import BoardWritePage from "./pages/board/BoardWritePage.jsx";
import MainPage from "./pages/MainPage.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import SysAdminUserPage from "./pages/sysadmin/SysAdminUserPage.jsx";
import SysAdminOrgPage from "./pages/sysadmin/SysAdminOrgPage.jsx";
import SysAdminBoardPage from "./pages/sysadmin/SysAdminBoardPage.jsx";
import SysAdminReviewPage from "./pages/sysadmin/SysAdminReviewPage.jsx";
import SysAdminPartyPage from "./pages/sysadmin/SysAdminPartyPage.jsx";
import SysAdminNoticePage from "./pages/sysadmin/SysAdminNoticePage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OrgAdminMemberPage from "./pages/orgadmin/OrgAdminMemberPage.jsx";
import OrgAdminTeamPage from "./pages/orgadmin/OrgAdminTeamPage.jsx";
import OrgAdminTaskPage from "./pages/orgadmin/OrgAdminTaskPage.jsx";
import OrgAdminCounselPage from "./pages/orgadmin/OrgAdminCounselPage.jsx";
import OrgAdminNoticePage from "./pages/orgadmin/OrgAdminNoticePage.jsx";
import LocalReviewPage from "./pages/localreview/LocalReviewPage.jsx";

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
        <Route element={<Layout />}>
          <Route path="/localReview" element={<LocalReviewPage />} />
          <Route path="/chat" element={<ChatPage />} />
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
            <Route path="member" element={<OrgAdminMemberPage />} />
            <Route path="team" element={<OrgAdminTeamPage />} />
            <Route path="task" element={<OrgAdminTaskPage />} />
            <Route path="counsel" element={<OrgAdminCounselPage />} />
            <Route path="notice" element={<OrgAdminNoticePage />} />
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
