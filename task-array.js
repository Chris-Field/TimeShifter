import { Task } from './task.js'
import { formatDatetimeForTaskArray } from './datetime-format.js';
import { schedule } from './schedule-tasks.js';


export function saveTaskArray(taskArray, taskListHtml) {
  // update the localStorage
  saveToLocalStorage(taskArray);
  // render them to screen
  renderTaskArray(taskArray, taskListHtml);
}


export function loadTaskArray() {
  const taskArray = loadFromDatabase();
  if (!taskArray) {
    console.log("No tasks to load from database.");
    return [];
  };

  // Because localStorage only supports strings, and JSON.parse()
  // doesn't automatically convert the datetimes we need to 
  // manually convert the startDateTime and dueDateTime to date objects
  taskArray.forEach((task) => {
    task.startDateTime = new Date(task.startDateTime);
    task.dueDateTime = new Date(task.dueDateTime);
    if (task.workTimePlanned) {
      task.workTimePlanned.startDateTime = new Date(task.workTimePlanned.startDateTime);
      task.workTimePlanned.endDateTime = new Date(task.workTimePlanned.endDateTime);
    }
  });

  schedule(taskArray);

  console.log('Loaded tasks from database:');
  console.log(taskArray);

  return taskArray;
}


function saveToLocalStorage(taskArray) {
  // convert the array to string then store it.
  localStorage.setItem('tasks', JSON.stringify(taskArray));
}


function loadFromDatabase() {
  const reference = localStorage.getItem('tasks');
  if (reference) {
    // converts back to array and store it in tasks array
    return JSON.parse(reference);
  }
}


// Deletes the task from tasks array,
// then updates localstorage 
// and renders updated list to screen
export function deleteTask(taskToDelete, taskArray, taskListHtml) {
  // filters out the <li> with the id and updates the tasks array
  taskArray = taskArray.filter(function(comparisonTask) {
    // Use != not !==, because here types are different:
    // number vs. string.
    return comparisonTask.id != taskToDelete.id;
  });

  saveTaskArray(taskArray, taskListHtml)
}


export function findTaskById(id, taskArray) {
  for (let task of taskArray) {
    // use == not ===, because here types are different. One is number and other is string
    if (task.id == id) {
      return new Task(task);
    }
  };
  // If nothing is found
  throw `Task ${id} could not be found in array`
}


function renderTaskArray(taskArray, taskListHtml) {
  // Clear everything inside <ul> with class=task-list
  taskListHtml.innerHTML = '';

  // Run through each task inside taskArray
  for (let task of taskArray) {
    let taskHtmlLi = generateTaskHtmlLi(task);
    taskListHtml.append(taskHtmlLi);
  };
}


function generateTaskHtmlLi(task) {
  // check if the task is completed
  const checked = task.completed ? 'checked' : null;

  // make a <li> element and fill it
  // <li> </li>
  const li = document.createElement('li');
  // <li class="task"> </li>
  li.setAttribute('class', 'task');
  // <li class="task" data-key="20200708"> </li>
  li.setAttribute('data-key', task.id);

  // If task is completed, then add a class to <li> called 'checked',
  // which will add line-through style.
  if (task.completed === true) {
    li.classList.add('checked');
  }

  const nameHtml = task.name ? (`${task.name}.`) : ('');
  const startDateTimeHtml = task.startDateTime ?
    (`Start: ${formatDatetimeForTaskArray(task.startDateTime)}`) : ('');
  const dueDateTimeHtml = task.dueDateTime ?
    (`Due: ${formatDatetimeForTaskArray(task.dueDateTime)}`) : ('');
  const urgencyHtml = task.urgency ? (`${task.urgency}.`) : ('');
  const estimatedTimeHtml = task.estTimeTillFinished ? (`${task.estTimeTillFinished}`) : ('');
  const shiftHtml = task.shift ? (`during ${task.shift}.`) : ('');
  const recurringHtml = task.recurring ? (`Recurring: ${task.recurring}.`) : ('');
  const assigneeHtml = task.assignee ? (`${task.assignee}.`) : ('');
  const notesHtml = task.notes.innerHTML ? (`${task.notes.innerHTML}.`) : ('');
  // Hidden fields to be removed
  const workTimePlannedHtml = task.workTimePlanned ? (`Planned work time: ${formatDatetimeForTaskArray(task.workTimePlanned['startDateTime'])}-${task.workTimePlanned['endDateTime'].getHours()}:${task.workTimePlanned['endDateTime'].getMinutes()}.`) : ('');
  const parentHtml = task.parent ? (`${task.parent}.`) : ('');

  li.innerHTML = `
    <input type="checkbox" class="checkbox" ${checked}>
    <a href="#">
      <span class="task-list-name">${nameHtml}</span>
      <span class="task-list-start-date">${startDateTimeHtml}</span>
      <span class="task-list-due-date">${dueDateTimeHtml}</span>
      <span class="task-list-urgency">${urgencyHtml}</span>
      <span class="task-list-est-time-till-finished">${estimatedTimeHtml}</span>
      <span class="task-list-shift">${shiftHtml}</span>
      <span class="task-list-recurring">${recurringHtml}</span>
      <span class="task-list-assignee">${assigneeHtml}</span>
      <span class="task-list-notes">${notesHtml}</span>
      <span class="task-list-work-time-planned">${workTimePlannedHtml}</span>
      <span class="task-list-parent">${parentHtml}</span>
    </a>
    <button class="delete-button">X</button>
 `;

  return li
}


/**
 * Save the task details in main task array
 * @param {object} task - The task to save
 * @param {array} taskArray - Full list of all tasks
 * @param {array} taskListHtml - HTML code of the visual task list
 */
export function updateTaskInArray(task, taskArray, taskListHtml) {
  if (task === null) { return }
  // Check if task already exists.
  // If so, update details.
  // Otherwise add it to tasks array.
  const taskIndex = task.getMatchingTaskIndex(taskArray);
  if (taskIndex > -1) {
    console.log("Saving task detail for existing task: ");
    console.log(task);
    // Update task details
    taskArray[taskIndex] = task;
  } else {
    console.log("Saving task detail for new task: ");
    console.log(task);
    taskArray.push(task);
  }

  schedule(taskArray);

  saveTaskArray(taskArray, taskListHtml)
};