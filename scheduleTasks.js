// Finished compare(), which is the system to order the tasks based on Urgency then Due Date (excluding future start dates, as those are all at the end and in order of Start Date).
// Also set schedule() to just assign 1 task per day, from the top of the priority list to the bottom.

// NEXT UP:
// Before diving too much further, see if the Google flexible event feature will cover most of this by automatically finding a good place for each task. But I suppose the problem is we'd have to then access those and move them around. But we'll probably be doing that anyway, once we have integration with calendars...
// Based on the below (particularly getAvailableTime()),
// it's clear that I just need to start assigning workTimePlanned to each task.
// If everything has a work time, I can use that to calculate how much time
// I have left each day to schedule.
// And if necessary I can remove the workTimePlanned to put the task back
// into the prioritization rotation (e.g. if it gets replaced by a higher priority).
// I now have WORKTIME as a constant, which is a list of each day and its worktime block(s).
// Working on workTimeNextAvailable().
// Got it to work except for the fact that it pulls in duplicates when there are skipped days.
// For example, it goes through each day of the week and finds the next available slot.
// On Sunday it pulls Monday's slot, then on Monday it pulls Monday's slot again.
// Maybe find a way to advance the date whenever it pulls a slot?
// Or maybe this would be a good time to incorporate the multiple slots per day. For example, start right now and look for slots in the future and grab the first one. Then update the current datetime to match the end datetime of the slot that was just returned. Rinse and repeat until currDateTime > maxDateTime (which is calculated based on numDaysToCheck)
// Then to assign the tasks, look for the first task in the list
// with minimum block size that is less than or equal to the slot size.
// (using compare(), even if there is already a workTimePlanned that is after
// the time slot because we want to override it if we find a better slot).
// For now minBlockSize can just be estTimeTillFinished
// so that we don't have to dive into the world of parent/child just yet.

// At some point I should probably break up parents into children. Then give each child a (less important) due date, which is based on the parent due date but distributed between the days between now and the parent due date. There should probably be a universal maxBlockSize, which is 3 hours or something. So the child blocks would have a size of 3h unless broken up to fit in before their child due date.
// Example: parent: 9h long, due in 3 days. childA: 3h, due tomorrow, childB: 3h, due in 2 days, childC: 3h, due date matching parent. We could also space it out if needed. For example, if parent: 9h, due in 18 days, then childA: 3h, due in 6 days, childB: 3h, due in 12 days, and childC: 3h, due date matching parent.


import { formatDatetimeForTaskList } from './datetimeFormat.js';


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

  for (let i = 0; i < tasks.length; i++) {
    const currTask = tasks[i];

    const today = new Date();
    const nextDate = getNextDate(today, i)
    const daysToCheck = SCHEDULE_DISTANCE_DEFAULT - i
    const wtPlanned = workTimeNextAvailable(nextDate, daysToCheck);
    
    //console.log(nextDate.getDate(), daysToCheck, wtPlanned);

    currTask.workTimePlanned = wtPlanned;
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


function logTopThree(taskList) {
  console.log(`Top 3 tasks:`);
  taskList.slice(0, 3).forEach((task) => {
    const nameHtml = task.name ? (`${task.name}.`) : ('');
    const startDateTimeHtml = task.startDateTime ?
      (`Start: ${formatDatetimeForTaskList(task.startDateTime)}`) : ('');
    const dueDateTimeHtml = task.dueDateTime ?
      (`Due: ${formatDatetimeForTaskList(task.dueDateTime)}`) : ('');
    console.log(`Task ${nameHtml} ${startDateTimeHtml}. ${dueDateTimeHtml}.`);
  });
}


function workTimeNextAvailable(startDateTime, numDaysToCheck) {
  // For the next SCHEDULE_DISTANCE_DEFAULT days if date range not defined
  // workTimeDefaultDaily - (sum of all tasks with workTimePlanned on this day)

  // Does NOT support multiple WT slots on the same day, yet.

  for (let i = 0; i < numDaysToCheck; i++) {
    const currDate = getNextDate(startDateTime, i);
    const currDayOfWeek = currDate.getDay();
    const currWtDay = WORKTIME[currDayOfWeek];
    if (currWtDay.length > 0) {
      const currWtBlock = currWtDay[0]
      const currWtBlockStart = currWtBlock['startTime']
      const currWtBlockEnd = currWtBlock['endTime']
      const nextAvailable = {
        startDateTime: new Date(currDate.setHours(currWtBlockStart[0], currWtBlockStart[1], 0, 0)),
        endDateTime: new Date(currDate.setHours(currWtBlockEnd[0], currWtBlockEnd[1], 0, 0))
      }
      console.log(nextAvailable['startDateTime'].toISOString());
      return nextAvailable;
    }
  }
  // If it makes it to this point, there are no upcoming worktime slots
  return null;
}



// Do I want to find the next OPEN slot and place something in there,
// or do I simply want to find the next WORKTIME block and fill it in?



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
  const nextDate = new Date(startDate.setDate(startDate.getDate() + daysToAdvance));
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}