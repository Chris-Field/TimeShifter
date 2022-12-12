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
    const dayHtml = document.querySelector('.days > .mon > .events');
    dayHtml.append(eventHtml);
  }
}