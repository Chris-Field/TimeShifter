import React from 'react';

export const CalEvent = ({ event, dayStartTime = 8, chunksPerHour = 4 }) => {
  const startTime = event.startTime;
  const endTime = event.endTime;
  const gridRowStart = (startTime - dayStartTime) * chunksPerHour + 1;
  const eventHeight = (endTime - startTime) * 4;
  const eventStyle = {
    gridRow: gridRowStart,
    gridRowEnd: `span ${eventHeight}`,
  };

  return (
    <div className='event' data-key={event.dataKey} style={eventStyle}>
      <p className='title'>{event.name}</p>
    </div>
  );
};
