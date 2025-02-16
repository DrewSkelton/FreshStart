import React, { useState, useEffect } from 'react';
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react';
import { createViewDay, createViewMonthAgenda, createViewMonthGrid, createViewWeek } from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import '@schedule-x/theme-default/dist/index.css';
import '../styles/calendar.css';
import { createEvent } from 'ics';

const Calendar = () => {
  const [eventsService] = useState(() => createEventsServicePlugin());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new TypeError('Response is not JSON');
        }
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    fetchEvents();
  }, []);

  const calendar = useCalendarApp({
    views: [createViewMonthGrid(), createViewMonthAgenda(), createViewWeek(), createViewDay()],
    events: events,
    //isDark: true,

    monthGridOptions: {
      nEventsPerDay: 8,
    },

    callbacks: {
      onDateClick: (date) => {
        console.log('onDateClick', date);
      },
      onEventClick: (calendarEvent) => {
        console.log('onEventClick', calendarEvent);
      },
      onClickAgendaDate: (date) => {
        console.log('onClickAgendaDate', date);
      },
      onRender: ($app) => {
        console.log('onRender', $app);
      },
    },
  });

  const exportToICS = (event) => {
    const { title, start, duration, description, location } = event;

    const eventData = {
      title,
      description,
      location,
      start, // [YYYY, MM, DD, HH, MM]
      duration, // { hours: X, minutes: Y }
    };

    createEvent(eventData, (error, value) => {
      if (error) {
        console.error(error);
        return;
      }

      // Create a downloadable .ics file
      const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'event.ics';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const getGoogleCalendarUrl = (event) => {
    const { title, start, duration, description, location } = event;
    const startDate = new Date(Date.UTC(...start)).toISOString().replace(/-|:|\.\d+/g, '');
    const endDate = new Date(Date.UTC(...start));
    endDate.setHours(endDate.getHours() + duration.hours);
    endDate.setMinutes(endDate.getMinutes() + duration.minutes);
    const endDateString = endDate.toISOString().replace(/-|:|\.\d+/g, '');

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDateString}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;
  };

  const exampleEvent = {
    title: 'FarmStart Meeting',
    start: [2025, 2, 20, 10, 0], // [Year, Month, Day, Hour, Minute]
    duration: { hours: 1, minutes: 30 },
    description: 'Weekly progress meeting for FarmStart project',
    location: 'Zoom Link: https://zoom.us/j/123456789',
  };

  return (
    <div className='calendar'>
      <ScheduleXCalendar calendarApp={calendar} />
      <div className='export-buttons'>
        <button onClick={() => exportToICS(exampleEvent)}>Export to Calendar</button>
        <a href={getGoogleCalendarUrl(exampleEvent)} target="_blank" rel="noopener noreferrer">Add to Google Calendar</a>
      </div>
    </div>
  );
};


export default Calendar;
