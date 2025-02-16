import React, { useEffect, useRef } from 'react';
import { createCalendar } from '@schedule-x/calendar';
import { createEventsServicePlugin } from '@schedule-x/events-service';
import '@schedule-x/theme-default/dist/index.css';

const Calendar = ({ tasks }) => {
  const calendarRef = useRef(null);

  useEffect(() => {
    if (!calendarRef.current) return;

    const calendarConfig = {
      plugins: [createEventsServicePlugin()],
      locale: 'en-US',
      defaultView: 'week',
      events: tasks.map(task => ({
        id: task.id,
        title: task.title,
        start: task.start,
        end: task.end,
        description: task.description,
        location: task.location,
        color: getEventColor(task.type)
      })),
      dayBoundaries: {
        start: '06:00',
        end: '18:00',
      },
      weekOptions: {
        nDays: 7,
        eventWidth: 95,
      },
      callbacks: {
        onEventClick: (event) => {
          console.log('Event clicked:', event);
          const task = tasks.find(t => t.id === event.id);
          console.log('Full task details:', task);
        }
      }
    };

    const calendar = createCalendar(calendarConfig);
    calendar.render(calendarRef.current);

    return () => {
      // Cleanup if needed
      if (calendarRef.current) {
        calendarRef.current.innerHTML = '';
      }
    };
  }, [tasks]);

  function getEventColor(type) {
    const colors = {
      irrigation: '#4CAF50',
      fertilization: '#2196F3',
      harvest: '#FFC107',
      default: '#9E9E9E'
    };
    return colors[type] || colors.default;
  }

  return (
    <div className="calendar-wrapper">
      <div ref={calendarRef} className="calendar-container"></div>
    </div>
  );
};

export default Calendar;