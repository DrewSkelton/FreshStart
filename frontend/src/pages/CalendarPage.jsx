
export const farmTasks = [
  {
    id: 1,
    title: "Water Tomatoes",
    start: "2025-02-20T07:00", // Format as YYYY-MM-DDTHH:mm
    end: "2025-02-20T08:00",
    description: "Water tomato section using drip irrigation",
    location: "Section A",
    type: "irrigation"
  },
  {
    id: 2,
    title: "Fertilize Corn",
    start: "2025-02-21T09:00",
    end: "2025-02-21T10:30",
    description: "Apply nitrogen-based fertilizer to corn field",
    location: "Section B",
    type: "fertilization"
  },
  {
    id: 3,
    title: "Harvest Carrots",
    start: "2025-02-22T08:00",
    end: "2025-02-22T09:00",
    description: "Harvest mature carrots from bed 3",
    location: "Section C",
    type: "harvest"
  }
];


// CalendarPage.jsx
import React from 'react';
import Calendar from '../components/Calendar';

const CalendarPage = () => {

  return (
    <div className="calendar-page">
      <h1>Farm Task Calendar</h1>
      <Calendar tasks={farmTasks} />
    </div>
  );
};

export default CalendarPage;