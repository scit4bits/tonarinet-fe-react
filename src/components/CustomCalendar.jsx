import { useEffect, useState } from "react";
import taxios from "../utils/taxios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useTranslation } from "react-i18next";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Grid,
  Box,
  Divider,
} from "@mui/material";
import { TranslatableText } from "./TranslatableText";
import "moment-timezone";

moment.tz.setDefault("Asia/Seoul");
const localizer = momentLocalizer(moment);

export default function CustomCalendar() {
  const [events, setEvents] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchEvents() {
      const startOfCurrentMonth = moment()
        .startOf("month")
        .toDate()
        .toISOString()
        .split(".")[0];
      const endOfCurrentMonth = moment()
        .endOf("month")
        .toDate()
        .toISOString()
        .split(".")[0];

      const response = await taxios.get(
        `/schedule/org/0?start=${startOfCurrentMonth}&end=${endOfCurrentMonth}`
      );

      // make every date in data to moment object with Seoul timezone
      response.data = response.data.map((event) => ({
        ...event,
        fromWhen: moment.utc(event.fromWhen).tz("Asia/Seoul").toDate(),
        toWhen: event.toWhen
          ? moment.utc(event.toWhen).tz("Asia/Seoul").toDate()
          : null,
      }));
      setEvents(response.data);
    }

    fetchEvents();
  }, []);

  const handleRangeChange = async (range) => {
    let start, end;
    if (Array.isArray(range)) {
      // week view or day view
      start = moment(range[0])
        .startOf("day")
        .toDate()
        .toISOString()
        .split(".")[0];
      end = moment(range[range.length - 1])
        .endOf("day")
        .toDate()
        .toISOString()
        .split(".")[0];
    } else if (range.start && range.end) {
      // month view or agenda view
      start = moment(range.start)
        .startOf("day")
        .toDate()
        .toISOString()
        .split(".")[0];
      end = moment(range.end).endOf("day").toDate().toISOString().split(".")[0];
    }

    const response = await taxios.get(
      `/schedule/org/0?start=${start}&end=${end}`
    );
    // make every date in data to moment object with Seoul timezone
    response.data = response.data.map((event) => ({
      ...event,
      fromWhen: moment.utc(event.fromWhen).tz("Asia/Seoul").toDate(),
      toWhen: event.toWhen
        ? moment.utc(event.toWhen).tz("Asia/Seoul").toDate()
        : null,
    }));

    setEvents(response.data);
  };

  const messages = {
    date: t("calendar.date"),
    time: t("calendar.time"),
    event: t("calendar.event"),
    allDay: t("calendar.allDay"),
    week: t("calendar.week"),
    work_week: t("calendar.work_week"),
    day: t("calendar.day"),
    month: t("calendar.month"),
    previous: "<",
    next: ">",
    yesterday: t("calendar.yesterday"),
    tomorrow: t("calendar.tomorrow"),
    today: t("calendar.today"),
    agenda: t("calendar.agenda"),

    noEventsInRange: t("calendar.noEventsInRange"),

    showMore: (total) => `+${total} more`,
  };

  const handleSelectEvent = (value) => {
    setSelectedEvent(value);
    setDialogOpen(true);
  };

  return (
    <>
      <Calendar
        localizer={localizer}
        events={events}
        tooltipAccessor="description"
        allDayAccessor="allDay"
        startAccessor="fromWhen"
        endAccessor="toWhen"
        onRangeChange={handleRangeChange}
        onSelectEvent={handleSelectEvent}
        defaultView="month"
        messages={messages}
        style={{ height: "500px", width: "100%" }}
      />
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="lg"
      >
        <DialogTitle>
          <TranslatableText>
            <Typography
              variant="h5"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              {selectedEvent?.title}
            </Typography>
          </TranslatableText>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 1 }}>
            <TranslatableText>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {selectedEvent?.description || t("common.unknown")}
              </Typography>
            </TranslatableText>
          </Box>
          <Divider sx={{ mb: 1 }} />
          <Grid container spacing={1}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                <strong>{t("common.from")}:</strong>{" "}
                {selectedEvent?.fromWhen
                  ? moment(selectedEvent.fromWhen)
                      .tz("Asia/Seoul")
                      .format("YYYY-MM-DD HH:mm")
                  : t("common.na")}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                <strong>{t("common.to")}:</strong>{" "}
                {selectedEvent?.toWhen
                  ? moment(selectedEvent.toWhen)
                      .tz("Asia/Seoul")
                      .format("YYYY-MM-DD HH:mm")
                  : t("common.na")}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                <strong>{t("calendar.allDay")}:</strong>{" "}
                {selectedEvent?.allDay ? t("common.yes") : t("common.no")}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                <strong>{t("common.type")}:</strong>{" "}
                {selectedEvent?.type || t("common.na")}
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 1 }} />
          <Grid container spacing={1}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                <strong>{t("common.createdBy")}:</strong>{" "}
                {selectedEvent?.createdByName || t("common.na")} (
                {t("common.id")}: {selectedEvent?.createdById})
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                <strong>{t("common.createdAt")}:</strong>{" "}
                {selectedEvent?.createdAt
                  ? moment(selectedEvent.createdAt)
                      .tz("Asia/Seoul")
                      .format("YYYY-MM-DD HH:mm")
                  : t("common.na")}
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} variant="contained">
            {t("common.close")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
