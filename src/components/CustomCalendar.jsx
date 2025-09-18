import { useEffect, useState } from "react";
import taxios from "../utils/taxios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useTranslation } from "react-i18next";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function CustomCalendar() {
  const [events, setEvents] = useState([]);
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
      setEvents(response.data);
    }

    fetchEvents();
  }, []);

  const handleRangeChange = async (range) => {
    let start, end;
    console.log(range);
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

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      onRangeChange={handleRangeChange}
      defaultView="month"
      messages={messages}
      style={{ height: "500px", width: "100%" }}
    />
  );
}
