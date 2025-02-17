import React, { useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/calendar.css'; // Assuming custom styles

const localizer = momentLocalizer(moment);

const generateRandomTasks = () => {
  const tasks = [
    'Water Plants',
    'Fertilize Garden',
    'Prune Trees',
    'Harvest Vegetables',
    'Plant Seeds',
    'Weed Garden',
    'Check Soil pH',
    'Mulch Garden Beds',
    'Inspect for Pests',
    'Compost Organic Waste',
    'Transplant Seedlings',
    'Harvest Herbs',
    'Clean Garden Tools',
    'Set Up Irrigation',
    'Plan Crop Rotation',
  ];

  const events = [];
  const startDate = new Date(2025, 0, 1); // January 1, 2025
  const endDate = new Date(2025, 2, 31); // March 31, 2025

  for (let date = startDate; date <= endDate; date.setDate(date.getDate() + Math.floor(Math.random() * 2))) {
    const taskCount = Math.floor(Math.random() * 3); // 1 or 2 tasks per day
    for (let i = 0; i < taskCount; i++) {
      const taskIndex = Math.floor(Math.random() * tasks.length);
      const startHour = Math.floor(Math.random() * 8) + 8; // Random start hour between 8 AM and 4 PM
      const endHour = startHour + Math.floor(Math.random() * 2) + 1; // Duration between 1 and 2 hours

      events.push({
        id: events.length + 1,
        title: tasks[taskIndex],
        start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), startHour, 0),
        end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), endHour, 0),
      });
    }
  }

  return events;
};

const Calendar = () => {
  const [events, setEvents] = useState(generateRandomTasks());

  return (
    <div className="calendar-container">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 700 }}
        views={['month', 'week', 'day']}
        defaultView="month"
      />
    </div>
  );
};

export default Calendar;