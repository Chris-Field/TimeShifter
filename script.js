import { schedule } from './scheduleTasks.js';
import {
  formatDatetimeForTaskList,
  zeroPaddedDate,
  zeroPaddedtime
} from './datetimeFormat.js';
import { Task } from './task.js';


/////////////////////// TO DO ////////////////////////////////
// notes in scheduleTasks.js

// Needs to auto subtract based once time has been logged in task history.
// This would be a separate function where, when a child task is logged
// the parent has its estTimeTillFinished subtracted
/////////////////////////////////////////////////////////////







// Select everything
// Select the New Task button
const newTaskButton = document.querySelector('.new-task-button');
// Select the task form
const taskForm = document.querySelector('.task-detail');
// Select the input box
const taskInput = document.querySelector('#task-name');
// Select the <ul> with class="task-list"
const taskList = document.querySelector('.task-list');

// Array which stores every task
let TASKS = [];

// Default the task form as hidden
hideTaskForm();

// Add an eventListener on "new task" button,
// and listen for click event.
newTaskButton.addEventListener('click', function() {
  const task = collectTaskDetailsFromArray();
  displayTaskForm(task);
});

// Add an eventListener on task form,
// and listen for submit event
taskForm.addEventListener('submit', function(event) {
  // Prevent the page from reloading when submitting the form
  event.preventDefault();
  // Add default HTML content to the HTML text editor
  // in the Notes field
  quill.setContents([
    { insert: 'Hello ' },
    { insert: 'World!', attributes: { bold: true } },
    { insert: '\n' }
  ]);
  hideTaskForm();

  const taskDetails = collectTaskDetailsFromForm();
  taskDetails.saveTask(TASKS);
});


// Hide/show time input fields on the task detail form
// only if a date is selected.
taskForm.addEventListener('focusout', (event) => {
  showHideTimeInputFields(event.target);
});

// Process date/time fields based on urgency selection
// in the task detail form.
taskForm.addEventListener('click', (event) => {
  const selection = event.target;

  if (selection.classList.contains('cancel-button')) {
    hideTaskForm();
  }

  showHideDateTimeInputFields(selection.id);

});

function hideDateTimeInputFields() {
  const dueDateTime = document.querySelector('.task-due');
  dueDateTime.classList.add('hidden');
  const startDateTime = document.querySelector('.task-start');
  startDateTime.classList.add('hidden');
}

function showDateTimeInputFields() {
  const dueDateTime = document.querySelector('.task-due');
  dueDateTime.classList.remove('hidden');
  const startDateTime = document.querySelector('.task-start');
  startDateTime.classList.remove('hidden');
}

function showHideDateTimeInputFields(taskUrgency) {
  switch (taskUrgency) {
    case 'task-urgency-1':
      hideDateTimeInputFields();
      break;
    case 'task-urgency-2':
      showDateTimeInputFields();
      break;
    case 'task-urgency-3':
      showDateTimeInputFields();
      break;
    case 'task-urgency-4':
      hideDateTimeInputFields();
      break;
  }
}

function showHideTimeInputFields(selectedField) {
  const id = selectedField.id;

  // We're only concerned with the start date and due date fields
  if (id === 'task-start-date' || id === 'task-due-date') {
    const childrenOfParent = selectedField.parentNode.childNodes;

    // Loop through label and input fields for start/due, respectively.
    for (let i = 0; i < childrenOfParent.length; i++) {
      const child = childrenOfParent[i];
      const classes = child.classList;

      // Skip irrelevant Text content that causes errors.
      if (child.nodeName === '#text') { continue; }

      // Find the Time fields
      if (classes.contains('task-due-time') || classes.contains('task-start-time')) {

        // If the date is filled in, show the time field.
        if (selectedField.value) {
          classes.remove('hidden');

          // If the date is empty, wipe the time
          // and hide the field.
        } else {
          classes.add('hidden');
          child.value = '';
        }
      }
    }
  }
}


function collectTaskDetailsFromArray(id) {

  // Set the default values
  const task = new Task();

  // Fill in values from the task pulled from array
  if (id) {
    // Use == not ===, because here types are different,
    // string vs. number.
    const loadedTask = TASKS.find(element => element.id == id);

    task.id = loadedTask.id;
    task.name = loadedTask.name;
    task.startDateTime = loadedTask.startDateTime;
    task.dueDateTime = loadedTask.dueDateTime;
    task.urgency = loadedTask.urgency;
    task.estTimeTillFinished = loadedTask.estTimeTillFinished;
    task.shift = loadedTask.shift;
    task.recurring = loadedTask.recurring;
    task.assignee = loadedTask.assignee;
    task.notes = loadedTask.notes;
    task.completed = loadedTask.completed;
    // Hidden fields
    task.workTimePlanned = loadedTask.workTimePlanned;
    task.parent = loadedTask.parent;
  }

  return task
}


function displayTaskForm(task) {
  console.log('Displaying task details for:');
  console.log(task);

  const taskDetailWindow = document.querySelector('.task-detail-popup');

  showHideDateTimeInputFields(task.urgency)
  console.log('startDateTime:', task.startDateTime.toString());

  console.log('Setting background attributes for task details');
  taskDetailWindow.setAttribute('data-key', task.id);
  taskDetailWindow.setAttribute('data-shift', task.shift);
  taskDetailWindow.setAttribute('data-recurring', task.recurring);
  taskDetailWindow.setAttribute('data-assignee', task.assignee);
  taskDetailWindow.setAttribute('data-completed', task.completed);

  console.log('Autofilling form inputs based on task details');
  document.querySelector('input[name="task-name"]').value = task.name;
  document.querySelector('input[name="task-start-date"]')
    .value = zeroPaddedDate(task.startDateTime);
  document.querySelector('input[name="task-start-time"]')
    .value = zeroPaddedtime(task.startDateTime);
  document.querySelector('input[name="task-due-date"]')
    .value = zeroPaddedDate(task.dueDateTime);
  document.querySelector('input[name="task-due-time"]')
    .value = zeroPaddedtime(task.dueDateTime);

  document.querySelector('#' + task.urgency).checked = true;
  document.querySelector('select[name="task-est-time-till-finished"]').value = task.estTimeTillFinished;

  showHideTimeInputFields(document.querySelector('#task-start-date'));
  showHideTimeInputFields(document.querySelector('#task-due-date'));

  taskDetailWindow.style.display = 'block';
}


function hideTaskForm() {
  document.querySelector('.task-detail-popup')
    .style.display = 'none';
}


// function to render given tasks to screen
export function renderTaskList(tasks) {
  // clear everything inside <ul> with class=task-list
  taskList.innerHTML = '';

  // run through each task inside tasks
  tasks.forEach(function(task) {
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
      (`Start: ${formatDatetimeForTaskList(task.startDateTime)}`) : ('');
    const dueDateTimeHtml = task.dueDateTime ?
      (`Due: ${formatDatetimeForTaskList(task.dueDateTime)}`) : ('');
    const urgencyHtml = task.urgency ? (`${task.urgency}.`) : ('');
    const estimatedTimeHtml = task.estTimeTillFinished ? (`${task.estTimeTillFinished}`) : ('');
    const shiftHtml = task.shift ? (`during ${task.shift}.`) : ('');
    const recurringHtml = task.recurring ? (`Recurring: ${task.recurring}.`) : ('');
    const assigneeHtml = task.assignee ? (`${task.assignee}.`) : ('');
    const notesHtml = task.notes.innerHTML ? (`${task.notes.innerHTML}.`) : ('');
    // Hidden fields to be removed
    const workTimePlannedHtml = task.workTimePlanned ? (`Planned work time: ${formatDatetimeForTaskList(task.workTimePlanned['startDateTime'])}-${task.workTimePlanned['endDateTime'].getHours()}:${task.workTimePlanned['endDateTime'].getMinutes()}.`) : ('');
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
    // finally add the <li> to the <ul>
    taskList.append(li);
  });

}


function getFromLocalStorage() {
  const reference = localStorage.getItem('tasks');

  if (reference) {
    // converts back to array and store it in tasks array
    TASKS = JSON.parse(reference);
  }

  // Because localStorage only supports strings, and JSON.parse()
  // doesn't automatically convert the datetimes we need to 
  // manually convert the startDateTime and dueDateTime to date objects
  TASKS.forEach((task) => {
    task.startDateTime = new Date(task.startDateTime);
    task.dueDateTime = new Date(task.dueDateTime);
    if (task.workTimePlanned) {
      task.workTimePlanned.startDateTime = new Date(task.workTimePlanned.startDateTime);
      task.workTimePlanned.endDateTime = new Date(task.workTimePlanned.endDateTime);
    }
  });

  schedule(TASKS);

  console.log('loaded tasks:');
  console.log(TASKS);
}


// toggle the value to completed and not completed
function toggleChecked(id) {
  TASKS.forEach(function(task) {
    // use == not ===, because here types are different. One is number and other is string
    if (task.id == id) {
      // toggle the value
      task.completed = !task.completed;
    }
  });

  saveToLocalStorage(TASKS);
  // render them to screen
  renderTaskList(TASKS);
}


// Gather the input from all the fields when saving the task
function collectTaskDetailsFromForm() {

  console.log("Collecting task data from details popup:")
  const taskDetailWindow = document.querySelector('.task-detail-popup');

  const task = new Task(
  taskDetailWindow.getAttribute('data-key'),
  document.querySelector('input[name="task-name"]').value,
  collectDateTimeFromForm('start'),
  collectDateTimeFromForm('due'),
  document.querySelector('input[name="task-urgency"]:checked').id,
  document.querySelector('select[name="task-est-time-till-finished"]').value,
  'Work hours',
  false,
  1,
  quill.getContents(),
  false
    )
  console.log('date pre-override: ' + task.startDateTime);

  overrideTaskDateTimeValues(task);
  console.log('date post-override: ' + task.startDateTime);

  return task;
}


function collectDateTimeFromForm(datetimeType) {
  const collectedDate =
    document.querySelector(`input[name="task-${datetimeType}-date"]`).value;
  const collectedTime =
    document.querySelector(`input[name="task-${datetimeType}-time"]`).value;

  // It automatically converts from local time to UTC
  // including Daylight Savings, based on the date specified.
  return new Date(`${collectedDate} ${collectedTime}`);
}


function overrideTaskDateTimeValues(task) {
  // Update the datetime values based on urgency
  if (task.urgency === 'task-urgency-1') {
    task.startDateTime = new Date();
    task.startDateTime.setHours(0, 0, 0, 0);
    task.dueDateTime = new Date();
  }
  if (task.urgency === 'task-urgency-4') {
    task.startDateTime = new Date("2999-12-01T00:00:00");
    task.dueDateTime = new Date("2999-12-01T00:00:00");
  }
}


// initially get everything from localStorage
getFromLocalStorage();
// And render it to the screen
renderTaskList(TASKS);

// after that addEventListener <ul> with class=taskList. Because we need to listen for click event in all delete-button and checkbox
taskList.addEventListener('click', function(event) {
  // get id from data-key attribute's value of parent <li>
  const parentLi = event.target.closest('li');
  const taskId = parentLi.getAttribute('data-key');

  // check if the event is on checkbox
  if (event.target.type === 'checkbox') {
    // toggle the state
    toggleChecked(taskId);
  }

  // check if that is a delete-button
  else if (event.target.classList.contains('delete-button')) {
    deleteTask(taskId);
  }

  // Otherwise open the task detail window
  else {
    const taskDetails = collectTaskDetailsFromArray(taskId);
    displayTaskForm(taskDetails);
  }

});

