import React from 'react';

const numHours = 15;
const startingTime = 8; // TODO: Convert to Military time

export const Timeline = () => {
  return (
    <div className='timeline'>
      <div className='spacer'></div>
      {createTimeMarkers(numHours, startingTime)}
    </div>
  );
};

function createTimeMarkers(numHours, startingTime) {
  const timeMarkers = [];
  
  for (let i = 0; i < numHours; i++) {
    let currentHour = startingTime + i;
    let amPm = 'AM';
    if (currentHour > 12) {
      amPm = 'PM';
      currentHour = currentHour % 12;
    }
    timeMarkers.push(
      <div className='time-marker' key={currentHour}>
        {currentHour} {amPm}
      </div>
    );
  }

  return timeMarkers;
}
