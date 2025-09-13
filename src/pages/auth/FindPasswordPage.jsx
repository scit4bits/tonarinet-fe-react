import {useState} from "react";
import {Link} from "react-router";
import {useTranslation} from "react-i18next";
import taxios from "../../utils/taxios";
import LogoWithTitle from "../../assets/logoWithTitle.png";
import {Alert, Box, Button, Container, Paper, TextField, Typography,} from "@mui/material";
import LanguageSelector from "../../components/LanguageSelector";

export default function FindPasswordPage() {
    const [t] = useTranslation();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        if (!email) {
            setError(t("common.allFieldsRequired"));
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await taxios.get(`/auth/forgot-password?email=${encodeURIComponent(email)}`);
            setMessage(t("common.passwordResetEmailSent"));
            console.log("Password reset request successful:", response.data);
        } catch (error) {
            console.error("`Password reset error:", error);
            setError(t("common.passwordResetFailed"));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-10">
            <Box sx={{position: "absolute", top: 16, right: 16}}>
                <LanguageSelector/>
            </Box>
            <title>{t("forgotPassword")}</title>
            <Box sx={{display: "flex", justifyContent: "center", mb: 4}}>
                <Link to="/">
                    <img src={LogoWithTitle} alt="Logo" className="h-[100px]"/>
                </Link>
            </Box>
            <Container maxWidth="sm">
                <Paper elevation={10} sx={{p: 4}}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        {t("forgotPassword")}
                    </Typography>

                    <Typography variant="body1" color="textSecondary" align="center" sx={{mb: 3}}>
                        {t("common.resetPasswordDescription")}
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
                            id="email"
                            label={t("email")}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            required
                            autoComplete="email"
                            autoFocus
                            placeholder={t("common.enterEmailPlaceholder")}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                            disabled={loading}
                        >
                            {loading ? t("common.loading") : t("common.sendResetLink")}
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