import React from 'react';
import { CalEvent } from './Event'

export const Day = ({ day }) => {
  return (
    <div className='day' id={day.id}>
      <div className='date'>
        <p className='date-num'>{day.dayNumber}</p>
        <p className='date-day'>{day.dayName}</p>
      </div>
      <div className='events'>
        {day.events.map((event, index) => (
          <CalEvent key={index} event={event}/>
        ))}
      </div>
    </div>
  );
};
