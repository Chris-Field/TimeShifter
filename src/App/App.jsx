import React, { useState, useEffect } from 'react';
import { loadTaskArray } from '../../task-array';
import { Calendar } from '../Calendar';

export const App = () => {
  const [nav, setNav] = useState(0);
  const [clicked, setClicked] = useState();
  const [tasks, setTasks] = useState([]);
  const [days, setDays] = useState([]);
  const [dateDisplay, setDateDisplay] = useState('');
  const [events, setEvents] = useState(loadTaskArray());

  localStorage.getItem('events')
    ? JSON.parse(localStorage.getItem('events'))
    : [];

  const eventForDate = (date) => events.find((e) => e.date === date);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  return (
    <div className='main'>
      <Calendar />
    </div>
  );
};
