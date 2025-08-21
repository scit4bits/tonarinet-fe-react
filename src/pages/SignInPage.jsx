import taxios from "../utils/taxios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import CountryData from "../data/country.json";
import { useTranslation } from "react-i18next";
import { IconButton } from "@mui/material";

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
      console.log("Sign up successful:", response.data);
      localStorage.setItem("accessToken", response.data.data);
    } catch (error) {
      console.error("Sign up error:", error);
      alert("Sign up failed. Please try again.");
    }
  }

  return (
    <div className="text-left">
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <br />
        <input
          type="email"
          placeholder="Email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label htmlFor="password">패스워드</label>
        <br />
        <input
          type="password"
          placeholder="비밀번호"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />

        <button type="submit">Sign In</button>
        <Link to="/signup">Sign Up</Link>
        <br />
        <div className="flex flex-row">
          <IconButton onClick={onClickLoginGoogle}>
            Google
            <GoogleIcon />
          </IconButton>
          <IconButton onClick={onClickLoginLine}>
            LINE
            <GoogleIcon />
          </IconButton>
          <IconButton onClick={onClickLoginKakao}>
            Kakao
            <GoogleIcon />
          </IconButton>
        </div>
      </form>
    </div>
  );
}
