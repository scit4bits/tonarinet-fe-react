import {useEffect, useState} from "react";
import {Link, useNavigate, useSearchParams} from "react-router";
import {useTranslation} from "react-i18next";
import taxios from "../../utils/taxios";
import LogoWithTitle from "../../assets/logoWithTitle.png";
import {Alert, Box, Button, CircularProgress, Container, Paper, TextField, Typography,} from "@mui/material";
import LanguageSelector from "../../components/LanguageSelector";

export default function ResetPasswordPage() {
    const [t] = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [validatingToken, setValidatingToken] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [tokenValid, setTokenValid] = useState(false);

    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            setError(t("invalidResetToken"));
            setValidatingToken(false);
            return;
        }

        async function validateResetToken() {
            try {
                const response = await taxios.get(`/auth/validate-reset-token?token=${token}`);
                if (response.data === true || response.data.valid === true) {
                    setTokenValid(true);
                } else {
                    setError(t("invalidResetToken"));
                }
            } catch (error) {
                console.error("Token validation error:", error);
                setError(t("validateResetTokenFailed"));
            } finally {
                setValidatingToken(false);
            }
        }

        validateResetToken();
    }, [token, t]);

    async function handleSubmit(event) {
        event.preventDefault();

        if (!password || !confirmPassword) {
            setError(t("common.allFieldsRequired"));
            return;
        }

        if (password !== confirmPassword) {
            setError(t("common.passwordsDoNotMatch"));
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const payload = {token, newPassword: password};
            const response = await taxios.post("/auth/reset-password", payload);
            setMessage(t("common.passwordResetSuccessful"));
            console.log("Password reset successful:", response.data);

            // Redirect to sign in page after 3 seconds
            setTimeout(() => {
                navigate("/signin");
            }, 3000);
        } catch (error) {
            console.error("Password reset error:", error);
            setError(t("common.passwordResetFailed"));
        } finally {
            setLoading(false);
        }
    }

    if (validatingToken) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center p-10">
                <Box sx={{position: "absolute", top: 16, right: 16}}>
                    <LanguageSelector/>
                </Box>
                <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <CircularProgress sx={{mb: 2}}/>
                    <Typography variant="body1">
                        {t("common.loading")}
                    </Typography>
                </Box>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center p-10">
                <Box sx={{position: "absolute", top: 16, right: 16}}>
                    <LanguageSelector/>
                </Box>
                <title>{t("common.resetPassword")}</title>
                <Box sx={{display: "flex", justifyContent: "center", mb: 4}}>
                    <Link to="/">
                        <img src={LogoWithTitle} alt="Logo" className="h-[100px]"/>
                    </Link>
                </Box>
                <Container maxWidth="sm">
                    <Paper elevation={10} sx={{p: 4}}>
                        <Typography variant="h4" component="h1" gutterBottom align="center">
                            {t("common.resetPassword")}
                        </Typography>

                        <Alert severity="error" sx={{mb: 2}}>
                            {error}
                        </Alert>

                        <Box sx={{textAlign: "center", mt: 2}}>
                            <Link to="/forgot-password" style={{textDecoration: "none"}}>
                                <Typography variant="body2" color="primary">
                                    {t("forgotPassword")}
                                </Typography>
                            </Link>
                        </Box>
                    </Paper>
                </Container>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-10">
            <Box sx={{position: "absolute", top: 16, right: 16}}>
                <LanguageSelector/>
            </Box>
            <title>{t("common.resetPassword")}</title>
            <Box sx={{display: "flex", justifyContent: "center", mb: 4}}>
                <Link to="/">
                    <img src={LogoWithTitle} alt="Logo" className="h-[100px]"/>
                </Link>
            </Box>
            <Container maxWidth="sm">
                <Paper elevation={10} sx={{p: 4}}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        {t("common.resetPassword")}
                    </Typography>

                    <Typography variant="body1" color="textSecondary" align="center" sx={{mb: 3}}>
                        {t("common.resetPasswordPageDescription")}
                    </Typography>

                    {message && (
                        <Alert severity="success" sx={{mb: 2}}>
                            {message}
                        </Alert>
                    )}

                    {error && (
                        <Alert severity="error" sx={{mb: 2}}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{mt: 3}}>
                        <TextField
                            fullWidth
                            id="password"
                            label={t("common.newPassword")}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            required
                            autoComplete="new-password"
                            autoFocus
                        />

                        <TextField
                            fullWidth
                            id="confirmPassword"
                            label={t("common.confirmPassword")}
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            margin="normal"
                            required
                            autoComplete="new-password"
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                            disabled={loading}
                        >
                            {loading ? t("common.loading") : t("common.resetPassword")}
                        </Button>

                        <Box sx={{textAlign: "center", mt: 2}}>
                            <Link to="/signin" style={{textDecoration: "none"}}>
                                <Typography variant="body2" color="primary">
                                    {t("common.rememberPassword")} {t("signIn")}
                                </Typography>
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </div>
    );
}
