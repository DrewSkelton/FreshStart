import React, { useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/calendar.css'; // Assuming custom styles

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'My new event',
      start: new Date(2025, 0, 1, 0, 0), // Months are 0-based in JS
      end: new Date(2025, 0, 1, 2, 0),
    },
  ]);

  return (
    <div style={{ height: 750, width: 1000 }}>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ margin: '20px' }}
      />
    </div>
  );
};

export default Calendar;
