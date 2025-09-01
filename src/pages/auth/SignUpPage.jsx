import taxios from "../../utils/taxios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import CountryData from "../../data/country.json";
import { useTranslation } from "react-i18next";
import LogoWithTitle from "../../assets/logoWithTitle.png";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { checkEmailDup } from "../../utils/auth";

export default function SignUpPage({ provider }) {
  const [t, i18n] = useTranslation();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const [oAuthData, setOAuthData] = useState(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState(null);
  const [gender, setGender] = useState("");
  const [emailError, setEmailError] = useState(null);

  // Transform country data for Autocomplete
  const countryOptions = Object.entries(CountryData).map(([key, value]) => ({
    id: key,
    label: i18n.language === "ko" ? value.korean : value.japanese,
    code: key,
  }));

  useEffect(() => {
    async function getOAuthData() {
      try {
        if (provider) {
          const checkUrl = `/auth/${provider}/check?code=${code}&state=${state}`;
          const checkResponse = await taxios.get(checkUrl);
          const checkData = checkResponse.data;

          try {
            const authUrl = `/auth/signin/oauth`; // this must have provider and openid sub
            const authResponse = await taxios.post(authUrl, {
              provider,
              oauthid: checkData.oauthid,
            });
            if (authResponse.status === 200) {
              localStorage.setItem("accessToken", authResponse.data.data);
              window.location.href = "/testauth";
              return;
            }
          } catch (error) {
            console.log("it seems we don't have any account. go for Signup.");
          }

          setOAuthData(checkData);
          setName(checkData.name || "");
          setReady(true);
        }
        setReady(true);
      } catch (error) {
        console.error("Error fetching OAuth data:", error);
        provider = null;
        setReady(true);
      }
    }

    getOAuthData();
  }, []);

  async function onEmailInputHandler(event) {
    const targetEmail = event.target.value;
    // email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(targetEmail)) {
      setEmailError("Invalid email format");
      return;
    }

    if (!(await checkEmailDup(targetEmail))) {
      setEmailError("Email is already in use");
    } else {
      setEmailError(null);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    // Handle form submission
    const formData = new FormData(event.target);

    // Validation checks
    if (
      !(email || oAuthData?.email) ||
      !password ||
      !passwordRepeat ||
      !name ||
      !birth ||
      !nickname ||
      !phone ||
      !nationality ||
      !gender
    ) {
      alert("All fields are required");
      return;
    }

    if (emailError) {
      alert(emailError);
      return;
    }

    if (password !== passwordRepeat) {
      alert("Passwords do not match");
      return;
    }

    if (nickname.length > 10) {
      alert("Nickname must be at most 10 characters");
      return;
    }

    const phoneRegex = /^\d{3}-\d{4}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
      alert("Phone format must be 000-0000-0000");
      return;
    }

    // Make axios post request
    try {
      const payload = {
        email: oAuthData?.email || email,
        password,
        name,
        birth,
        nickname,
        phone,
        gender,
        nationality: nationality?.id || nationality,
        provider,
        oauthid: oAuthData?.oauthid || null,
      };
      console.log(payload);
      const response = await taxios.post("/auth/signup", payload);
      console.log("Sign up successful:", response.data);
    } catch (error) {
      console.error("Sign up error:", error);
      alert("Sign up failed. Please try again.");
    }
  }

  if (!ready) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper elevation={10} sx={{ p: 4, textAlign: "center" }}>
          <CircularProgress />
        </Paper>
      </Container>
    );
  }

  return (
    <div className="w-full h-full p-10">
      <title>{t("pages.auth.signUp.title")}</title>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Link to="/">
          <img src={LogoWithTitle} alt="Logo" className="h-[100px]" />
        </Link>
      </Box>

      <Container maxWidth="sm">
        <Paper elevation={10} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {t("signUp", "Sign Up")}
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              type="email"
              label="Email"
              value={oAuthData?.email || email}
              onChange={(e) => {
                setEmail(e.target.value);
                onEmailInputHandler(e);
              }}
              margin="normal"
              disabled={!!oAuthData?.email}
              required
              autoComplete="email"
            />

            {emailError && (
              <Typography color="error" variant="body2" className="text-left">
                {emailError}
              </Typography>
            )}

            <TextField
              fullWidth
              type="password"
              label={t("password", "Password")}
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              autoComplete="new-password"
            />

            <TextField
              fullWidth
              type="password"
              label={t("passwordRepeat", "Confirm Password")}
              placeholder="비밀번호 재확인"
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
              margin="normal"
              required
              autoComplete="new-password"
            />

            <TextField
              fullWidth
              type="text"
              label={t("name", "Name")}
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
              autoComplete="name"
            />

            <TextField
              fullWidth
              type="text"
              label={t("nickname", "Nickname")}
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              margin="normal"
              slotProps={{ htmlInput: { maxLength: "10" } }}
              required
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>{t("gender", "Gender")}</InputLabel>
              <Select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                label={t("gender", "Gender")}
              >
                <MenuItem value="male">{t("male", "Male")}</MenuItem>
                <MenuItem value="female">{t("female", "Female")}</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              type="date"
              label={t("birthdate", "Birth Date")}
              value={birth}
              onChange={(e) => setBirth(e.target.value)}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              type="tel"
              label={t("phone", "Phone")}
              placeholder="전화번호"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              margin="normal"
              required
              autoComplete="tel"
            />

            <Autocomplete
              fullWidth
              options={countryOptions}
              value={nationality}
              onChange={(event, newValue) => setNationality(newValue)}
              getOptionLabel={(option) => option.label || ""}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("nationality", "Nationality")}
                  placeholder={
                    i18n.language === "ko"
                      ? "국가를 선택하세요"
                      : "Select a country"
                  }
                  margin="normal"
                  required
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Typography variant="body1">{option.label}</Typography>
                </Box>
              )}
              sx={{ mt: 1, mb: 1 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {t("signUp", "Sign Up")}
            </Button>

            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Link to="/signin" style={{ textDecoration: "none" }}>
                <Typography variant="body2" color="primary">
                  {t("alreadyHaveAccount", "Already have an account? Sign In")}
                </Typography>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </div>
  );
}
