/**
* Draw the events on the calendar.
*/
export function drawEventsOnCalendar(taskArray, numHours = 14, dayStartTime = 9, chunksPerHour = 4) {
  console.log('Building calendar');
  for (const task of taskArray) {
    console.log(`Drawing task ${task.name}`);

    // Construct the div that holds the event
    const eventHtml = document.createElement('div');
    eventHtml.setAttribute('class', 'event');
    eventHtml.setAttribute('data-key', task.id);
    const eventHtmlName = document.createElement('p');
    eventHtmlName.innerHTML = `<p class="title">${task.name}</p>`;
    eventHtml.append(eventHtmlName);
    const startTime = task.workTimePlanned.startDateTime.getHours();
    console.log(startTime);
    const endTime = task.workTimePlanned.endDateTime.getHours();
    console.log(endTime);
    const gridRowStart = (startTime - dayStartTime) * chunksPerHour + 1;
    console.log(gridRowStart);
    const eventHeight = (endTime - startTime) * 4;
    eventHtml.style.gridRow = gridRowStart;
    eventHtml.style.gridRowEnd = `span ${eventHeight}`;

    // Add the event to the calendar
    const dayHtml = document.querySelector('.days > .one > .events');
    dayHtml.append(eventHtml);
  }
}

/**
* Set the date numbers on the calendar
*/
export function updateCalendarDayNumbers(dayLimit = 7) {
  const numberWordConversions = {
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five',
    6: 'six',
    7: 'seven'
  }
  let currDate = new Date();

  for (let i = 0; i < dayLimit; i++) {
    currDate = new Date(currDate.setDate(currDate.getDate() + 1));

    const dateDay = currDate.getDate();
    // Find the element for the day number
    const currDayNumber = document.querySelector(`.days > .${numberWordConversions[i + 1]} > .date > .date-num`)
    // Update the day number on the calendar
    currDayNumber.innerHTML = dateDay;
    // Update the day id
    // Zero-pad the day number
    const dateIso = currDate.toISOString();
    const dateFormatted = dateIso.slice(0, 10);
    currDayNumber.id = dateFormatted;
  }
}