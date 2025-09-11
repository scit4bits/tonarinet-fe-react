import taxios from "../../utils/taxios";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
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
import LanguageSelector from "../../components/LanguageSelector";

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
  const [countries, setCountries] = useState([]);

  // Transform country data for Autocomplete
  const countryOptions = countries.map((country) => ({
    id: country.countryCode,
    label: country.description,
    code: country.countryCode,
  }));

  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await taxios.get("/country");
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }

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
              window.location.href = "/main";
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
    fetchCountries();
  }, []);

  async function onEmailInputHandler(event) {
    const targetEmail = event.target.value;
    // email regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(targetEmail)) {
      setEmailError(t("common.invalidEmailFormat"));
      return;
    }

    if (!(await checkEmailDup(targetEmail))) {
      setEmailError(t("common.emailInUse"));
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
      alert(t("common.allFieldsRequired"));
      return;
    }

    if (emailError) {
      alert(emailError);
      return;
    }

    if (password !== passwordRepeat) {
      alert(t("common.passwordsDoNotMatch"));
      return;
    }

    if (nickname.length > 10) {
      alert(t("common.nicknameTooLong"));
      return;
    }

    const phoneRegex = /^\d{3}-\d{4}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
      alert(t("common.phoneFormatError"));
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
      window.location.href = "/signin";
    } catch (error) {
      console.error("Sign up error:", error);
      alert(t("common.signUpFailed"));
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
      <Box sx={{ position: "absolute", top: 16, right: 16 }}>
        <LanguageSelector />
      </Box>
      <title>{t("pages.auth.signUp.title")}</title>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Link to="/">
          <img src={LogoWithTitle} alt="Logo" className="h-[100px]" />
        </Link>
      </Box>

      <Container maxWidth="sm">
        <Paper elevation={10} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {t("signUp")}
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              type="email"
              label={t("email")}
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
              label={t("password")}
              placeholder={t("passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              autoComplete="new-password"
            />

            <TextField
              fullWidth
              type="password"
              label={t("passwordRepeat")}
              placeholder={t("passwordRepeatPlaceholder")}
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
              margin="normal"
              required
              autoComplete="new-password"
            />

            <TextField
              fullWidth
              type="text"
              label={t("name")}
              placeholder={t("namePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
              autoComplete="name"
            />

            <TextField
              fullWidth
              type="text"
              label={t("nickname")}
              placeholder={t("nicknamePlaceholder")}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              margin="normal"
              slotProps={{ htmlInput: { maxLength: "10" } }}
              required
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>{t("gender")}</InputLabel>
              <Select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                label={t("gender")}
              >
                <MenuItem value="male">{t("male")}</MenuItem>
                <MenuItem value="female">{t("female")}</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              type="date"
              label={t("birthdate")}
              value={birth}
              onChange={(e) => setBirth(e.target.value)}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              type="tel"
              label={t("phone")}
              placeholder={t("phonePlaceholder")}
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
                  label={t("nationality")}
                  placeholder={t("nationalityPlaceholder")}
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
              {t("signUp")}
            </Button>

            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Link to="/signin" style={{ textDecoration: "none" }}>
                <Typography variant="body2" color="primary">
                  {t("alreadyHaveAccount")}
                </Typography>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </div>
  );
}
