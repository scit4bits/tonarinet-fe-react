import { Button, IconButton } from "@mui/material";
import { Link } from "react-router";
import GoogleIcon from "@mui/icons-material/Google";
import axios from "axios";

export default function OAuthTestPage() {
  async function generateState() {
    const response = await axios.get(
      "http://localhost:8999/api/auth/generateState"
    );
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

  return (
    <div>
      <IconButton onClick={onClickLoginGoogle}>
        Login with Google
        <GoogleIcon />
      </IconButton>
      <IconButton onClick={onClickLoginLine}>
        Login with LINE
        <GoogleIcon />
      </IconButton>
      <IconButton onClick={onClickLoginKakao}>
        Login With Kakao
        <GoogleIcon />
      </IconButton>
    </div>
  );
}
