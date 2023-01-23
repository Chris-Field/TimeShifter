export function clearCalendarEvents() {
  const calendarDays = document.querySelectorAll('.events');
  for (const day of calendarDays) {
    day.innerHTML = '';
  }
}

/**
* Draw the event on the calendar.
*/
export function drawEventOnCalendar(task, numHours = 15, dayStartTime = 8, chunksPerHour = 4) {
  if (!task.workTimePlanned) {
    return;
  }
  console.log(`Drawing task ${task.name} at ${task.workTimePlanned.startDateTime.toISOString()}`);

  // Construct the div that holds the event
  const eventHtml = document.createElement('div');
  eventHtml.setAttribute('class', 'event');
  eventHtml.setAttribute('data-key', task.id);
  const eventHtmlName = document.createElement('p');
  eventHtmlName.innerHTML = `<p class="title">${task.name}</p>`;
  eventHtml.append(eventHtmlName);
  const startTime = task.workTimePlanned.startDateTime.getHours();
  const endTime = task.workTimePlanned.endDateTime.getHours();
  const gridRowStart = (startTime - dayStartTime) * chunksPerHour + 1;
  const eventHeight = (endTime - startTime) * 4;
  eventHtml.style.gridRow = gridRowStart;
  eventHtml.style.gridRowEnd = `span ${eventHeight}`;

  // Add the event to the calendar
  updateCalendarHTML(function (dayElement) {
    const calendarDayId = dayElement.querySelector('.date > .date-num').id;
    if (calendarDayId === zeroPaddedDate(task.workTimePlanned.startDateTime)) {
      const dayHtml = dayElement.querySelector(`.events`);
      dayHtml.append(eventHtml);
    }
  })
}


/**
* Set the date numbers on the calendar
 * @param {Number} dayLimit - User-specified number of days to show in the calendar week
 * @param {Number} firstDayOfWeek - The first day of the week, in integer form (i.e. 0 to start the calendar with Sunday, 1 for Monday, etc.)
*/
export function updateCalendarDayNumbers(dayLimit = 7, firstDayOfWeek = 0) {

  const today = new Date();
  const todayDayOfWeek = today.getDay() - (firstDayOfWeek % dayLimit);
  let currDate = today;
  currDate = new Date(currDate.setDate(currDate.getDate() - todayDayOfWeek));

  updateCalendarHTML(function (dayElement) {
    const dateDay = currDate.getDate();
    // Find the element for the day number
    const currDayNumber = dayElement.querySelector(`.date > .date-num`);
    // Update the day number on the calendar
    currDayNumber.innerHTML = dateDay;
    // Update the day id
    currDayNumber.id = zeroPaddedDate(currDate);

    // Move the date forward
    currDate = new Date(currDate.setDate(currDate.getDate() + 1));
  });
}


/**
 * Set the day names in the calendar heading
 * @param {Number} dayLimit - User-specified number of days to show in the calendar week
 * @param {Number} firstDayOfWeek - The first day of the week, in integer form (i.e. 0 to start the calendar with Sunday, 1 for Monday, etc.)
 */
export function updateCalendarDayNames(dayLimit = 7, firstDayOfWeek = 0) {
  const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const dayNameMatcher = {
    one: dayNames[(0 + firstDayOfWeek) % dayLimit],
    two: dayNames[(1 + firstDayOfWeek) % dayLimit],
    three: dayNames[(2 + firstDayOfWeek) % dayLimit],
    four: dayNames[(3 + firstDayOfWeek) % dayLimit],
    five: dayNames[(4 + firstDayOfWeek) % dayLimit],
    six: dayNames[(5 + firstDayOfWeek) % dayLimit],
    seven: dayNames[(6 + firstDayOfWeek) % dayLimit]
  }

  updateCalendarHTML(function (dayElement, cellName) {
    // Find the element for the day name
    const currDayName = dayElement.querySelector('.date > .date-day')
    // Update the day name on the calendar
    currDayName.innerHTML = dayNameMatcher[cellName];
  });
}


function updateCalendarHTML(funcForEachDay) {
  const calendarCellNames = ['one', 'two', 'three', 'four', 'five', 'six', 'seven']
  for (const cell of calendarCellNames) {
    // Find the element for the day name
    const currDayElement = document.querySelector(`.days > .${cell}`);
    // Update the day on the calendar
    funcForEachDay(currDayElement, cell);
  }
}


function zeroPaddedDate(date) {
  const dateIso = date.toISOString();
  const dateFormatted = dateIso.slice(0, 10);
  return dateFormatted;
}