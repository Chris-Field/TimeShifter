import React, { useEffect, useState } from 'react';
import { Day } from './Day';
import { Timeline } from './Timeline';

export const Calendar = () => {
  const [days, setDays] = useState([]);
  const [dayLimit, setDayLimit] = useState(7);
  const [firstDayOfWeek, setFirstDayOfweek] = useState(1);
  const [todayDayOfWeek, setTodayDayOfWeek] = useState(
    new Date().getDay() - (firstDayOfWeek % dayLimit)
  );

  useEffect(() => {
    const today = new Date();
    const todayDayOfWeek = today.getDay() - (firstDayOfWeek % dayLimit);

    const firstDayOfWeekDate = new Date();
    firstDayOfWeekDate.setDate(firstDayOfWeekDate.getDate() - todayDayOfWeek);

    const tmpDays = [];

    for (let iDayOfWeek = 0; iDayOfWeek < dayLimit; iDayOfWeek++) {
      const iDate = new Date(firstDayOfWeekDate);
      iDate.setDate(iDate.getDate() + iDayOfWeek);

      tmpDays.push({
        id: zeroPaddedDate(iDate),
        dayNumber: iDate.getDate(),
        dayName: getDayOfWeekName(iDayOfWeek, dayLimit, firstDayOfWeek),
        events: getEventsForDate(),
        isToday: isSameDate(iDate, today),
        date: iDate,
      });
    }
    setDays(tmpDays);
  }, [dayLimit, firstDayOfWeek, todayDayOfWeek]);

  return (
    <div className='calendar'>
      <Timeline />
      <div className='days'>
        {days.map((d, index) => (
          <Day key={index} day={d} />
        ))}
      </div>
    </div>
  );
};

/**
 * Set the day names in the calendar heading
 * @param {Number} currentDayOfWeek - The current day of the week, in integer form (i.e. 0 to start the calendar with Sunday, 1 for Monday, etc.)
 * @param {Number} firstDayOfWeek - The first day of the week, in integer form (i.e. 0 to start the calendar with Sunday, 1 for Monday, etc.)
 * @param {Number} dayLimit - User-specified number of days to show in the calendar week
 */
function getDayOfWeekName(currentDayOfWeek, dayLimit = 7, firstDayOfWeek = 0) {
  const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  return dayNames[(currentDayOfWeek + firstDayOfWeek) % dayLimit];
}

function isSameDate(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Set the time portion of both dates to 0
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);

  // Compare the date portion of the modified dates
  return d1.getTime() === d2.getTime();
}

function getEventsForDate(date) {
  return null;
}

function zeroPaddedDate(date) {
  const dateIso = date.toISOString();
  const dateFormatted = dateIso.slice(0, 10);
  return dateFormatted;
}
