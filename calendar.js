const DAYLIST = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

/**
* Draw the events on the calendar.
*/
export function drawEventsOnCalendar(taskArray, numHours = 14, dayStartTime = 9, chunksPerHour = 4) {
  console.log('Constructing calendar envents');
  for (const task of taskArray) {
    console.log(`Drawing task ${task.name} at ${task.workTimePlanned.startDateTime.toISOString()}`);

    // Construct the div that holds the event
    const eventHtml = document.createElement('div');
    eventHtml.setAttribute('class', 'event');
    eventHtml.setAttribute('data-key', task.id);
    const eventHtmlName = document.createElement('p');
    eventHtmlName.innerHTML = `<p class="title">${task.name}</p>`;
    eventHtml.append(eventHtmlName);
    const startTime = task.workTimePlanned.startDateTime.getHours();
    console.log('startTime: ', startTime);
    const endTime = task.workTimePlanned.endDateTime.getHours();
    console.log('endTime: ', endTime);
    const gridRowStart = (startTime - dayStartTime) * chunksPerHour + 1;
    console.log('gridRowStart: ', gridRowStart);
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
 * @param {Number} dayLimit - User-specified number of days to show in the calendar week
 * @param {Number} firstDayOfWeek - The first day of the week, in integer form (i.e. 0 to start the calendar with Sunday, 1 for Monday, etc.)
*/
export function updateCalendarDayNumbers(dayLimit = 7, firstDayOfWeek = 0) {

  const today = new Date();
  const todayDayOfWeek = today.getDay() - (firstDayOfWeek % dayLimit);
  let currDate = today;
  currDate = new Date(currDate.setDate(currDate.getDate() - todayDayOfWeek));

  updateCalendarHTML(function (dayName, dayElement) {
    const dateDay = currDate.getDate();
    // Find the element for the day number
    const currDayNumber = dayElement.querySelector(`.date-num`);
    // Update the day number on the calendar
    currDayNumber.innerHTML = dateDay;
    // Update the day id
    // Zero-pad the day number
    const dateIso = currDate.toISOString();
    const dateFormatted = dateIso.slice(0, 10);
    currDayNumber.id = dateFormatted;

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
  const dayNameMatcher = {
    one: DAYLIST[(0 + firstDayOfWeek) % dayLimit],
    two: DAYLIST[(1 + firstDayOfWeek) % dayLimit],
    three: DAYLIST[(2 + firstDayOfWeek) % dayLimit],
    four: DAYLIST[(3 + firstDayOfWeek) % dayLimit],
    five: DAYLIST[(4 + firstDayOfWeek) % dayLimit],
    six: DAYLIST[(5 + firstDayOfWeek) % dayLimit],
    seven: DAYLIST[(6 + firstDayOfWeek) % dayLimit]
  }

  updateCalendarHTML(function (dayName, dayElement) {
    // Find the element for the day name
    const currDayName = dayElement.querySelector('.date-day')
    // Update the day name on the calendar
    currDayName.innerHTML = dayNameMatcher[dayName];
  });
}


/**
 * Add HTML data values for the calendar days to link them with the actual dates.
 * @param {Number} dayLimit - User-specified number of days to show in the calendar week
 * @param {Number} firstDayOfWeek - The first day of the week, in integer form (i.e. 0 to start the calendar with Sunday, 1 for Monday, etc.)
 */
export function assignDatesToCalendarDays(dayLimit = 7, firstDayOfWeek = 0) {
  const today = new Date();

  const daysSinceDayOne = today.getDay() - firstDayOfWeek
  let dayOneDate = new Date()
  dayOneDate = new Date(dayOneDate.setDate(today.getDate() - daysSinceDayOne))
  console.log('dayOneDate: ', dayOneDate)

  for (let i = 0; i < dayLimit; i++) {

  }
}


function updateCalendarHTML(funcForEachDay) {
  const dayNameList = ['one', 'two', 'three', 'four', 'five', 'six', 'seven']
  for (const dayName of dayNameList) {
    // Find the element for the day name
    const currDayElement = document.querySelector(`.days > .${dayName} > .date`);
    // Update the day on the calendar
    funcForEachDay(dayName, currDayElement);
  }
}