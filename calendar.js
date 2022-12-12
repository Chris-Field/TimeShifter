export function drawEventsOnCalendar(taskArray) {
  console.log('Building calendar');
  for (const task of taskArray) {
    console.log(`Drawing task ${task.name}`);

    // Construct the div that holds the event
    const eventHtml = document.createElement('div')
    eventHtml.setAttribute('class', 'event')
    eventHtml.setAttribute('data-key', task.id);
    const eventHtmlName = document.createElement('p');
    eventHtmlName.innerHTML = `<p class="title">${task.name}</p>`;
    eventHtml.append(eventHtmlName);
    console.log(task.workTimePlanned.startDateTime.getHours())
    eventHtml.style.gridRow = '2';
    eventHtml.style.gridRowEnd = 'span 5';

    // Add the event to the calendar
    const dayHtml = document.querySelector('.days > .mon > .events');
    dayHtml.append(eventHtml);
  }
}