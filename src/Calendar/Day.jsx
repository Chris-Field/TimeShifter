import React from 'react';

export const Day = ({day}) => {
  return (
      <div className='day'>
      <div className='date'>
        <p className='date-num'>{day.dayNumber}</p>
        <p className='date-day'>{day.dayName}</p>
      </div>
      <div className='events'></div>
    </div>
  );
};
