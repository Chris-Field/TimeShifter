import { zeroPaddedDate, zeroPaddedtime } from './datetime-format.js';
import { Task } from './task.js';
import {
  deleteTaskFromArray,
  findTaskById,
  loadTaskArray,
  renderTasks,
  saveTaskArray,
  updateTaskInArray,
} from './task-array.js';
import {
  updateCalendarDayNames,
  updateCalendarDayNumbers,
} from './calendar.js';

/////////////////////// TO DO ////////////////////////////////
// Convert to React: https://youtu.be/Q5Xen_Y7lUk?t=1480.
// Ran into some import issues and an infinite loop.
// Now I want to create the calendar and then follow the video for stuff like onClick.
// After this, ask ChatGPT or The New Bing.

// Needs to auto subtract based once time has been logged in task history.
// This would be a separate function where, when a child task is logged
// the parent has its estTimeTillFinished subtracted
/////////////////////////////////////////////////////////////

// Select everything
// Select the New Task button
const newTaskButton = document.querySelector('.new-task-button');
// Select the task form
const taskForm = document.querySelector('.task-detail');
// Select the <ul> with class="task-list"
const taskListHtml = document.querySelector('.task-list');

// Default the task form as hidden
hideTaskForm();

// Order the days of the week on the calendar based on user preference
updateCalendarDayNames();
// Set the calendar dates
updateCalendarDayNumbers();

// initially get everything from localStorage
const taskArray = loadTaskArray();
// And render it to the screen
renderTasks(taskArray, taskListHtml);

// After that addEventListener <ul> with class=taskArray.
taskListHtml.addEventListener('click', function (event) {
  // get id from data-key attribute's value of parent <li>
  const parentLi = event.target.closest('li');
  const taskId = parentLi.getAttribute('data-key');
  const task = findTaskById(taskId, taskArray);

  // check if the event is on checkbox
  if (event.target.type === 'checkbox') {
    // toggle the state
    task.toggleChecked();
    saveTaskArray(taskArray, taskListHtml);
    renderTasks(taskArray, taskListHtml);
  }

  // Otherwise open the task detail window
  else {
    displayTaskForm(task);
  }
});

// Add an eventListener on "new task" button,
// and listen for click event.
newTaskButton.addEventListener('click', function () {
  const task = new Task();
  displayTaskForm(task);
});

// Add an eventListener on task form,
// and listen for submit event
taskForm.addEventListener('submit', function (event) {
  // Prevent the page from reloading when submitting the form
  event.preventDefault();
  // Add default HTML content to the HTML text editor
  // in the Notes field
  quill.setContents([
    { insert: 'Hello ' },
    { insert: 'World!', attributes: { bold: true } },
    { insert: '\n' },
  ]);
  hideTaskForm();

  const taskDetails = collectTaskDetailsFromForm();
  updateTaskInArray(taskDetails, taskArray, taskListHtml);
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
      if (child.nodeName === '#text') {
        continue;
      }

      // Find the Time fields
      if (
        classes.contains('task-due-time') ||
        classes.contains('task-start-time')
      ) {
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

function displayTaskForm(task) {
  console.log('Displaying task details for:');
  console.log(task);

  const taskDetailWindow = document.querySelector('.task-detail-popup');

  showHideDateTimeInputFields(task.urgency);
  console.log('startDateTime:', task.startDateTime.toString());

  console.log('Setting background attributes for task details');
  taskDetailWindow.setAttribute('data-key', task.id);
  taskDetailWindow.setAttribute('data-shift', task.shift);
  taskDetailWindow.setAttribute('data-recurring', task.recurring);
  taskDetailWindow.setAttribute('data-assignee', task.assignee);
  taskDetailWindow.setAttribute('data-completed', task.completed);

  console.log('Autofilling form inputs based on task details');
  document.querySelector('input[name="task-name"]').value = task.name;
  document.querySelector('input[name="task-start-date"]').value =
    zeroPaddedDate(task.startDateTime);
  document.querySelector('input[name="task-start-time"]').value =
    zeroPaddedtime(task.startDateTime);
  document.querySelector('input[name="task-due-date"]').value = zeroPaddedDate(
    task.dueDateTime
  );
  document.querySelector('input[name="task-due-time"]').value = zeroPaddedtime(
    task.dueDateTime
  );

  document.querySelector('#' + task.urgency).checked = true;
  document.querySelector('select[name="task-est-time-till-finished"]').value =
    task.estTimeTillFinished;

  showHideTimeInputFields(document.querySelector('#task-start-date'));
  showHideTimeInputFields(document.querySelector('#task-due-date'));

  taskDetailWindow.style.display = 'block';
}

function hideTaskForm() {
  document.querySelector('.task-detail-popup').style.display = 'none';
}

// Gather the input from all the fields when saving the task
function collectTaskDetailsFromForm() {
  console.log('Collecting task data from details popup:');
  const taskDetailWindow = document.querySelector('.task-detail-popup');

  const taskDetails = {
    id: taskDetailWindow.getAttribute('data-key'),
    name: document.querySelector('input[name="task-name"]').value,
    startDateTime: collectDateTimeFromForm('start'),
    dueDateTime: collectDateTimeFromForm('due'),
    urgency: document.querySelector('input[name="task-urgency"]:checked').id,
    estTimeTillFinished: document.querySelector(
      'select[name="task-est-time-till-finished"]'
    ).value,
    shift: 'Work hours',
    recurring: false,
    assignee: 1,
    notes: quill.getContents(),
    completed: false,
  };

  const task = new Task(taskDetails);

  overrideTaskDateTimeValues(task);

  return task;
}

function collectDateTimeFromForm(datetimeType) {
  const collectedDate = document.querySelector(
    `input[name="task-${datetimeType}-date"]`
  ).value;
  const collectedTime = document.querySelector(
    `input[name="task-${datetimeType}-time"]`
  ).value;

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
    task.startDateTime = new Date('2999-12-01T00:00:00');
    task.dueDateTime = new Date('2999-12-01T00:00:00');
  }
}
