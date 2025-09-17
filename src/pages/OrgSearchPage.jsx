import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Flag from "react-world-flags";
import useOrganizationList from "../hooks/useOrganizationList";
import { applyToOrganization } from "../utils/organization";
import { useTranslation } from "react-i18next";

// Custom hook for organization search
export default function OrgSearchPage() {
  const { t } = useTranslation();
  const { organizations, loading, search, setSearch } =
    useOrganizationList("name");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);
  };

  const handleApply = async (organizationId) => {
    try {
      await applyToOrganization(organizationId);

      alert(t("common.registrationCompleted"));
    } catch (error) {
      console.error(error);
      alert(t("common.registrationError"));
    }
    console.log("Applying to organization:", organizationId);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          value={search}
          onChange={handleInputChange}
          placeholder={t("common.organizationSearchPlaceholder")}
          slotProps={{
            htmlInput: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* Loading State */}
      {loading && (
        <Box display="flex" justifyContent="center" sx={{ my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Organization List */}
      <Stack spacing={2}>
        {!loading &&
          organizations.data.length > 0 &&
          organizations.data.map((org) => (
            <Card key={org.id} variant="outlined">
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={2}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  {/* Country Flag */}
                  <Flag
                    code={org.countryCode}
                    style={{
                      height: "24px",
                      boxShadow:
                        "0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
                    }}
                  />
                  <Typography variant="h6" component="div">
                    {org.name}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleApply(org.id)}
                >
                  {t("common.apply")}
                </Button>
              </Box>
            </Card>
          ))}
      </Stack>

      {/* Empty State */}
      {!loading && organizations.length === 0 && (
        <Box textAlign="center" sx={{ mt: 5 }}>
          <Typography variant="body1" color="text.secondary">
            {t("common.noOrganizationsFound")}
          </Typography>
        </Box>
      )}
    </Container>
  );
}
