import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Switch,
  FormControlLabel,
  MenuItem,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import CustomCalendar from "../../components/CustomCalendar";
import taxios from "../../utils/taxios";

// Schedule types for the dropdown
const SCHEDULE_TYPES = [
  "Meeting",
  "Event",
  "Deadline",
  "Reminder",
  "Maintenance",
  "Holiday",
  "Training",
  "Other",
];

export default function SysAdminSchedPage() {
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fromWhen: moment(),
    toWhen: moment().add(1, "hour"),
    type: "Event",
    allDay: false,
  });
  const [errors, setErrors] = useState({});

  const handleOpenDialog = () => {
    setDialogOpen(true);
    // Reset form when opening
    setFormData({
      title: "",
      description: "",
      fromWhen: moment(),
      toWhen: moment().add(1, "hour"),
      type: "Event",
      allDay: false,
    });
    setErrors({});
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleAllDayToggle = (event) => {
    const isAllDay = event.target.checked;
    setFormData((prev) => ({
      ...prev,
      allDay: isAllDay,
      // If switching to all day, set times to start/end of day
      fromWhen: isAllDay ? moment(prev.fromWhen).startOf("day") : prev.fromWhen,
      toWhen: isAllDay ? moment(prev.fromWhen).endOf("day") : prev.toWhen,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = t("scheduleManagement.validation.titleRequired");
    }

    if (!formData.description.trim()) {
      newErrors.description = t(
        "scheduleManagement.validation.descriptionRequired"
      );
    }

    if (!formData.fromWhen) {
      newErrors.fromWhen = t("scheduleManagement.validation.startDateRequired");
    }

    if (
      !formData.allDay &&
      formData.toWhen &&
      formData.fromWhen.isAfter(formData.toWhen)
    ) {
      newErrors.toWhen = t("scheduleManagement.validation.endTimeAfterStart");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const scheduleData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        fromWhen: formData.fromWhen.toISOString(),
        toWhen: formData.allDay
          ? formData.fromWhen.toISOString()
          : formData.toWhen.toISOString(),
        orgId: 0, // Fixed as requested
        type: formData.type,
        allDay: formData.allDay,
      };

      await taxios.post("/schedule", scheduleData);

      setSnackbar({
        open: true,
        message: t("scheduleManagement.scheduleCreatedSuccess"),
        severity: "success",
      });

      handleCloseDialog();

      // Refresh the browser as requested
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error creating schedule:", error);
      setSnackbar({
        open: true,
        message: t("scheduleManagement.scheduleCreateError"),
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            {t("scheduleManagement.pageTitle")}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={{ minWidth: 160 }}
          >
            {t("scheduleManagement.newSchedule")}
          </Button>
        </Box>

        <Box sx={{ mt: 3 }}>
          <CustomCalendar />
        </Box>

        {/* New Schedule Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>{t("scheduleManagement.createNewSchedule")}</DialogTitle>
          <DialogContent>
            <Box
              sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 3 }}
            >
              <TextField
                label={t("scheduleManagement.title")}
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                error={!!errors.title}
                helperText={errors.title}
                required
                fullWidth
              />

              <TextField
                label={t("scheduleManagement.description")}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                error={!!errors.description}
                helperText={errors.description}
                multiline
                rows={3}
                required
                fullWidth
              />

              <TextField
                select
                label={t("scheduleManagement.type")}
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                fullWidth
              >
                {SCHEDULE_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {t(`scheduleManagement.types.${type.toLowerCase()}`)}
                  </MenuItem>
                ))}
              </TextField>

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.allDay}
                    onChange={handleAllDayToggle}
                  />
                }
                label={t("scheduleManagement.allDay")}
              />

              {formData.allDay ? (
                <DatePicker
                  label={t("scheduleManagement.startDate")}
                  value={formData.fromWhen}
                  onChange={(value) => handleInputChange("fromWhen", value)}
                  slotProps={{
                    textField: {
                      error: !!errors.fromWhen,
                      helperText: errors.fromWhen,
                      required: true,
                      fullWidth: true,
                    },
                  }}
                />
              ) : (
                <DateTimePicker
                  label={t("scheduleManagement.startDateTime")}
                  value={formData.fromWhen}
                  onChange={(value) => handleInputChange("fromWhen", value)}
                  slotProps={{
                    textField: {
                      error: !!errors.fromWhen,
                      helperText: errors.fromWhen,
                      required: true,
                      fullWidth: true,
                    },
                  }}
                />
              )}

              {!formData.allDay && (
                <DateTimePicker
                  label={t("scheduleManagement.endDateTime")}
                  value={formData.toWhen}
                  onChange={(value) => handleInputChange("toWhen", value)}
                  slotProps={{
                    textField: {
                      error: !!errors.toWhen,
                      helperText: errors.toWhen,
                      required: true,
                      fullWidth: true,
                    },
                  }}
                  minDateTime={formData.fromWhen}
                />
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button onClick={handleCloseDialog}>
              {t("scheduleManagement.cancel")}
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? t("scheduleManagement.creating")
                : t("scheduleManagement.create")}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
}
