import React, { useState } from 'react';
import { Day } from './Day';
import { Timeline } from './Timeline';
// import { Timeline } from './Timeline';
// import Timeline from './Timeline';
// import Day from './Calendar';

export const Calendar = () => {
  const [days, setDays] = useState([]);

  const startingDay = 'Monday';

  return (
    <div className='calendar'>
      <>Hello from the Calendar component!</>
      <Timeline />
      <div className='days'>
        {days.map((d, index) => (
          <Day key={index} day={d} />
        ))}
      </div>
    </div>
  );
};
