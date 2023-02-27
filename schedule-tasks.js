import { formatDatetimeForTaskArray } from './datetime-format.js'

// It now assigns 1 task per time slot over the next 14 days. remaining tasks have a null workTimePlanned value

// NEXT UP:
// I think the most important thing is to have a visual representation
// so let's get a calendar view of the task list (weekly view).
// Here's where I landed after looking through a TON of options and posting on /r/learnjavascript:
// Use vanilla JS.
// Start with https://codepen.io/alvarotrigo/pen/KKQzvdr.
// Followed by https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API.
// And if relevant, throw in https://stackoverflow.com/questions/41745072/how-to-create-a-resizable-rectangle-in-javascript.
//
// Add border between calendar days. Make the yellow color more marigold. Less of a fade. Perhaps replace the yellow background with something darker.
//
// To assign the tasks, look for the first task in the list
// with minimum block size that is less than or equal to the slot size.
// For now minBlockSize can just be estTimeTillFinished
// so that we don't have to dive into the world of parent/child just yet.
// Then we need to start allowing multiple items per time slot if there is room.
// For example, once a time slot is assigned,
// the scheduler's current time is updated to wtPlanned.endDateTime.
// I need to do 2 things:
//   Make wtPlanned.endDateTime reflect the earliest value 
//     between wtSlot's endDateTime and the task's est finish datetime
//   Make a new slot from the leftover time in that wtSlot (if greater than 0m)

// At some point I should probably break up parents into children. Then give each child a (less important) due date, which is based on the parent due date but distributed between the days between now and the parent due date. There should probably be a universal maxBlockSize, which is 3 hours or something. So the child blocks would have a size of 3h unless broken up to fit in before their child due date.
// Example: parent: 9h long, due in 3 days. childA: 3h, due tomorrow, childB: 3h, due in 2 days, childC: 3h, due date matching parent. We could also space it out if needed. For example, if parent: 9h, due in 18 days, then childA: 3h, due in 6 days, childB: 3h, due in 12 days, and childC: 3h, due date matching parent.


const SCHEDULE_DISTANCE_DEFAULT = 14
const WORKTIME = {
  // 0 - 6 = Sunday - Saturday
  // Each day can have multiple blocks (or no blocks)
  0: [],
  1: [{ startTime: [17, 30], endTime: [20, 30] }],
  2: [{ startTime: [17, 30], endTime: [20, 30] }],
  3: [{ startTime: [17, 30], endTime: [20, 30] }],
  4: [{ startTime: [17, 30], endTime: [20, 30] }],
  5: [{ startTime: [17, 30], endTime: [20, 30] }],
  6: [{ startTime: [8, 0], endTime: [11, 0] }, { startTime: [16, 0], endTime: [17, 0] }]
}


function prioritize(tasks) {
  // Prioritize tasks based on:
  console.log('Prioritizing tasks');
  console.log('Task list length: ', tasks.length)

  logTopThree(tasks);

  tasks.sort(compare);

  // Debug
  logTopThree(tasks)

  return tasks;
}


export function schedule(tasks) {
  tasks = prioritize(tasks);
  let currDateTime = new Date();
  // Set currDateTime to yesterday's "next date"
  // In the future just use the current datetime
  currDateTime = getNextDate(new Date(currDateTime.setDate(currDateTime.getDate() - 1)));

  for (let i = 0; i < tasks.length; i++) {
    const currTask = tasks[i];

    // Set currDateTime to now,
    // and look for slots in the future,
    // then grab the first one.
    // Then update currDateTime to match the end datetime
    // of the slot that was just returned.
    // Rinse and repeat until currDateTime > maxDateTime,
    // which is calculated based on numDaysToCheck.

    const daysToCheck = SCHEDULE_DISTANCE_DEFAULT - i

    const wtPlanned = workTimeNextAvailable(currDateTime, daysToCheck);
    // set the workTimePlanned, even if it's null,
    // to overwrite the task's existing workTimePlanned
    currTask.workTimePlanned = wtPlanned;
    if (wtPlanned) {
      currDateTime = new Date(wtPlanned.endDateTime);
    }
  }
}


function compare(taskA, taskB) {
  // due date, start date, time estimate, and urgency

  /* RULES
  1. ASAP always wins if the start date is in the past.
  2. Hard is always second if the start date is in the past unless:
      If totalWorkTimeAvailable() > getEstTimeP1P2() * 2,
      I can fit a soft in there that is due before a hard.
      And If workTimeTotalAvailable() > getEstTimeP1P2() * 3
      (the number is arbitrary, need to test), I can fit a P4 in before the hard.
  3. Soft is always third if the start date is in the past.
  4. If start date in future, simply order by start date. After start date then urgency.
  */

  // First check if the startDateTime of either task is in the future
  // If so just list in order of startDateTime
  const now = new Date();
  if (taskA.startDateTime > now || taskB.startDateTime > now) {
    return compareTwoValues(taskA.startDateTime, taskB.startDateTime);
  }

  // Then check if urgency is the same
  // If so compare dueDateTime
  // Otherwise just compare urgency
  if (taskA.urgency === taskB.urgency) {
    return compareTwoValues(taskA.dueDateTime, taskB.dueDateTime)
  } else {
    return compareTwoValues(taskA.urgency, taskB.urgency)
  }

  function compareTwoValues(a, b) {
    if (a === b) {
      return 0;
    }
    return a < b ? -1 : 1;
  }

}


function logTopThree(taskArray) {
  console.log(`Top 3 tasks:`);
  taskArray.slice(0, 3).forEach((task) => {
    const nameHtml = task.name ? (`${task.name}.`) : ('');
    const startDateTimeHtml = task.startDateTime ?
      (`Start: ${formatDatetimeForTaskArray(task.startDateTime)}`) : ('');
    const dueDateTimeHtml = task.dueDateTime ?
      (`Due: ${formatDatetimeForTaskArray(task.dueDateTime)}`) : ('');
    // console.log(`Task ${nameHtml} ${startDateTimeHtml}. ${dueDateTimeHtml}.`);
  });
}


function workTimeNextAvailable(startDateTime, numDaysToCheck) {
  if (!numDaysToCheck) { numDaysToCheck = SCHEDULE_DISTANCE_DEFAULT };
  // Do I want to find the next OPEN slot and place something in there,
  // or do I simply want to find the next WORKTIME block and fill it in?

  const wtSlots = generateFutureWorkTimeSlots(startDateTime, numDaysToCheck);

  // Scan the list of upcoming worktimes,
  // and find the first one in the future
  for (let i = 0; i < wtSlots.length; i++) {
    const slot = wtSlots[i]
    if (slot.startDateTime > startDateTime) {
      return slot;
    }
  };

  // If it makes it to this point, there are no upcoming worktime slots
  return null;
}


function generateFutureWorkTimeSlots(startDateTime, numDaysToCheck) {
  if (!numDaysToCheck) { numDaysToCheck = SCHEDULE_DISTANCE_DEFAULT };
  const wtSlots = [];
  let currDate = new Date(startDateTime);
  for (let i = 0; i < numDaysToCheck; i++) {
    const currDayOfWeek = currDate.getDay();
    const currWtDay = WORKTIME[currDayOfWeek];
    for (let j = 0; j < currWtDay.length; j++) {
      const currWtBlock = currWtDay[j]
      const currWtBlockStart = currWtBlock['startTime']
      const currWtBlockEnd = currWtBlock['endTime']
      wtSlots.push({
        startDateTime: new Date(currDate.setHours(currWtBlockStart[0], currWtBlockStart[1], 0, 0)),
        endDateTime: new Date(currDate.setHours(currWtBlockEnd[0], currWtBlockEnd[1], 0, 0))
      });
    }
    currDate = getNextDate(new Date(currDate));
  }
  return wtSlots;
}




function workTimeTotalAvailable(startDateTime, endDateTime) {
  // For the next SCHEDULE_DISTANCE_DEFAULT days if date range not defined
  // Add up all hours in workDayBudget (Default 4 for testing purposes)
  // Subtract conflicting events (once applicable)
  // Subtract tasks with (if (workTimePlanned){...})
}


function getEstTimeP1P2(startDateTime, endDateTime) {
  // For the next SCHEDULE_DISTANCE_DEFAULT days if date range not defined
  // Calculate how much estTimeTillFinished for ASAP/hard tasks for the next 2 weeks.
}


function getNextDate(startDate, daysToAdvance) {
  if (!daysToAdvance) { daysToAdvance = 1 };
  const nextDate = new Date(startDate.setDate(startDate.getDate() + daysToAdvance));
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}