import taxios from "../../utils/taxios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import CountryData from "../../data/country.json";
import { useTranslation } from "react-i18next";
import LogoWithTitle from "../../assets/logoWithTitle.png";
import {
  Box,
  Button,
  Container,
  Divider,
  Icon,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import LineLogo from "../../assets/line.png";
import KakaoLogo from "../../assets/kakao.png";

import GoogleIcon from "@mui/icons-material/Google";

export default function SignInPage({}) {
  const [t, i18n] = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function generateState() {
    const response = await taxios.get("/auth/generateState");
    return response.data;
  }

  async function onClickLoginLine() {
    const { state, nonce } = await generateState();
    const url = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=2007926713&redirect_uri=https%3A%2F%2Ftn.thxx.xyz%2Flogincb%2Fline&state=${state}&scope=profile%20openid&nonce=${nonce}`;
    window.location.href = url;
  }

  async function onClickLoginKakao() {
    const { state, nonce } = await generateState();
    const url = `https://kauth.kakao.com/oauth/authorize
?client_id=3ff877eb66189acc8907dfc6b6d057c0
&redirect_uri=https%3A%2F%2Ftn.thxx.xyz%2Flogincb%2Fkakao
&response_type=code
&scope=profile_nickname,profile_image,openid
&state=${state}`;
    window.location.href = url;
  }

  async function onClickLoginGoogle() {
    const { state } = await generateState();
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=917977800926-c0uqjgmestu7ojov7as0cgr1vro99an0.apps.googleusercontent.com
&redirect_uri=https%3A%2F%2Ftn.thxx.xyz%2Flogincb%2Fgoogle
&response_type=code
&scope=openid%20email%20profile
&state=${state}`;
    window.location.href = url;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    if (!email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      const payload = {
        email,
        password,
      };
      const response = await taxios.post("/auth/signin/email", payload);
      console.log("Sign in successful:", response.data);
      localStorage.setItem("accessToken", response.data.data);
    } catch (error) {
      console.error("Sign in error:", error);
      alert("Sign in failed. Please try again.");
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-10">
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <img src={LogoWithTitle} alt="Logo" className="h-[100px]" />
      </Box>
      <Container maxWidth="sm">
        <Paper elevation={10} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {t("signIn", "Sign In")}
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              autoComplete="email"
              autoFocus
            />

            <TextField
              fullWidth
              id="password"
              label={t("password", "Password")}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              autoComplete="current-password"
            />

            <Link
              to="/forgot-password"
              style={{ textDecoration: "none", textAlign: "left" }}
            >
              <Typography variant="body2" color="primary">
                {t("forgotPassword", "Forgot Password?")}
              </Typography>
            </Link>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {t("signIn", "Sign In")}
            </Button>

            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Link to="/signup" style={{ textDecoration: "none" }}>
                <Typography variant="body2" color="primary">
                  {t("signUp", "Sign Up")}
                </Typography>
              </Link>
            </Box>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {t("orSignInWith", "Or sign in with")}
              </Typography>
            </Divider>

            <Stack direction="row" spacing={2} justifyContent="center">
              <Tooltip title="Sign in with Google">
                <IconButton
                  onClick={onClickLoginGoogle}
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    "&:hover": { borderColor: "primary.main" },
                  }}
                >
                  <GoogleIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Sign in with Line">
                <IconButton
                  onClick={onClickLoginLine}
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    "&:hover": { borderColor: "primary.main" },
                  }}
                >
                  <img
                    src={LineLogo}
                    alt="Line"
                    style={{ width: 24, height: 24 }}
                  />
                </IconButton>
              </Tooltip>

              <Tooltip title="Sign in with Kakao">
                <IconButton
                  onClick={onClickLoginKakao}
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    "&:hover": { borderColor: "primary.main" },
                  }}
                >
                  <img
                    src={KakaoLogo}
                    alt="Kakao"
                    style={{ width: 24, height: 24 }}
                  />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </div>
  );
}
