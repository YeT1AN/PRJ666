import React, { useRef, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import timeGridWeekPlugin from "@fullcalendar/timegrid";
import { useUser } from "../../contexts/UserContext";
import { getStudentEnrollments } from "../../services/apiStudent";

function Calendar() {
  const calendarRef = useRef(null);

  // Get userID ==> search the user's studentID from Students table ==> filter the student's enrolled courseIDs from Enrollments table
  // ==> get course objects from Courses table
  const { userNo } = useUser();
  const [enrollments, setEnrollments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEnrollments() {
      try {
        const enrollmentData = await getStudentEnrollments(userNo);
        setEnrollments(enrollmentData);
      } catch (error) {
        console.error("Failed to fetch enrollments:", error);
        setError("Failed to fetch enrollments.");
      }
    }

    fetchEnrollments();
  }, [userNo]);

  function formatTime(timeRange) {
    if (!timeRange) return null;

    // Split the time range into start and end times
    const [startTime, endTime] = timeRange.split("-");

    // Function to convert time string (e.g., "1:00pm") to 24-hour format string "HH:mm"
    const convertTo24Hour = (time) => {
      const [hour, minutePart] = time.split(":");
      const minute = minutePart.slice(0, 2);
      const amPm = minutePart.slice(2);

      let hour24 = parseInt(hour);
      if (amPm.toLowerCase() === "pm" && hour24 !== 12) {
        hour24 += 12; // Convert PM times to 24-hour format
      } else if (amPm.toLowerCase() === "am" && hour24 === 12) {
        hour24 = 0; // Convert 12 AM to 0 (midnight)
      }

      // Format hour and minute as "HH:mm"
      return `${hour24.toString().padStart(2, "0")}:${minute}`;
    };

    // Convert both start and end times to "HH:mm" format
    const formattedStartTime = convertTo24Hour(startTime);
    const formattedEndTime = convertTo24Hour(endTime);

    return {
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    };
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);

    return date.toISOString();
  }

  const events = enrollments.map((item) => {
    const { startTime, endTime } = formatTime(item.Time);

    return {
      id: item.CourseID,
      title: item.CourseName,
      startTime: startTime,
      endTime: endTime,
      startRecur: formatDate(item.StartDate),
      endRecur: formatDate(item.EndDate),
      extendedProps: {
        time: item.Time,
      },
    };
  });

  // When an event is clicked, it changes the calendar view to show a detailed day view
  // and show the specific date and time of the clicked event
  function handleClickEvent(clickInfo) {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView("timeGridDay", clickInfo.event.start);
    calendarApi.gotoDate(clickInfo.event.start);
  }

  return (
    <FullCalendar
      ref={calendarRef}
      plugins={[dayGridPlugin, interactionPlugin, timeGridWeekPlugin]}
      initialView="timeGridWeek"
      // Defines the buttons and title at the top of the calendar.
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      }}
      buttonText={{
        today: "Today",
        month: "Month",
        week: "Week",
        day: "Day",
      }}
      events={events}
      eventContent={(arg) => (
        <div>
          <b>{arg.event.title}</b>
          <div>{arg.event.extendedProps.time}</div>
        </div>
      )}
      eventDisplay="block"
      eventClick={handleClickEvent}
    />
  );
}

export default Calendar;
