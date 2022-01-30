// select everything
// select the task-new
const taskForm = document.querySelector('.task-new');
// select the input box
const taskInput = document.querySelector('#task-name');
// select the <ul> with class="task-list"
const taskList = document.querySelector('.task-list');

// array which stores every tasks
let tasks = [];

// add an eventListener on form, and listen for submit event
taskForm.addEventListener('submit', function(event) {
  // prevent the page from reloading when submitting the form
  event.preventDefault();
  quill.setContents([
  { insert: 'Hello ' },
  { insert: 'World!', attributes: { bold: true } },
  { insert: '\n' }
]);
  addtask(collectNewTaskData()); // call addtask function with input box current value
});

// function to add task
function addtask(task) {
  // if task is not empty
  if (task !== null) {

    // then add it to tasks array
    tasks.push(task);
    addToLocalStorage(tasks); // then store it in localStorage

    // finally clear the input box value
    clearNewTaskForm();
  }
}


function clearNewTaskForm(){
  taskInput.value = '';
}


// function to render given tasks to screen
function rendertasks(tasks) {
  // clear everything inside <ul> with class=task-list
  taskList.innerHTML = '';

  // run through each task inside tasks
  tasks.forEach(function(task) {
    // check if the task is completed
    const checked = task.completed ? 'checked': null;

    // make a <li> element and fill it
    // <li> </li>
    const li = document.createElement('li');
    // <li class="task"> </li>
    li.setAttribute('class', 'task');
    // <li class="task" data-key="20200708"> </li>
    li.setAttribute('data-key', task.id);
    /* <li class="task" data-key="20200708"> 
          <input type="checkbox" class="checkbox">
          Go to Gym
          <button class="delete-button">X</button>
        </li> */
    // if task is completed, then add a class to <li> called 'checked', which will add line-through style
    if (task.completed === true) {
      li.classList.add('checked');
    }

    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${checked}>
      ${task.name}
      <button class="delete-button">X</button>
    `;
    // finally add the <li> to the <ul>
    taskList.append(li);
  });

}

// function to add tasks to local storage
function addToLocalStorage(tasks) {
  // conver the array to string then store it.
  localStorage.setItem('tasks', JSON.stringify(tasks));
  // render them to screen
  rendertasks(tasks);
}

// function helps to get everything from local storage
function getFromLocalStorage() {
  const reference = localStorage.getItem('tasks');
  // if reference exists
  if (reference) {
    // converts back to array and store it in tasks array
    tasks = JSON.parse(reference);
    rendertasks(tasks);
  }
}

// toggle the value to completed and not completed
function toggle(id) {
  tasks.forEach(function(task) {
    // use == not ===, because here types are different. One is number and other is string
    if (task.id == id) {
      // toggle the value
      task.completed = !task.completed;
    }
  });

  addToLocalStorage(tasks);
}

// deletes a task from tasks array, then updates localstorage and renders updated list to screen
function deletetask(id) {

  // filters out the <li> with the id and updates the tasks array
  tasks = tasks.filter(function(task) {
    // use != not !==, because here types are different. One is number and other is string
    return task.id != id;
  });

  // update the localStorage
  addToLocalStorage(tasks);
}

// Gather the input from all the fields when submitting a new task
function collectNewTaskData(){
  
  console.log("Collecting new task data")
  
  const task = {
    id: Date.now(),
    name: document.querySelector('input[name="task-name"]').value,
    startDate: document.querySelector('input[name="task-start-date"]').value,
    startTime: document.querySelector('input[name="task-start-time"]').value,
    dueDate: document.querySelector('input[name="task-due-date"]').value,
    dueTime: document.querySelector('input[name="task-due-time"]').value,
    priority: document.querySelector('input[name="task-priority"]:checked').value,
    estimatedTime: document.querySelector('select[name="task-estimated-time"]').value,
    shift: 'Work hours',
    recurring: false,
    assignee: 1,
    notes: quill.getContents(),
    completed: false
  };

  console.log(task);

  return task;
}
   /*- [x] Due Datetime
    - [x] Start Datetime
    - [x] Notes (with full HTML support, like Outlook tasks)
    - [x] Priority (Possibly pull from Motion: ASAP, Hard Deadline, Soft Deadline, No Deadline) 
      - [ ] Which opens up the options to pick from different weeks to "Try to do within"
    - [x] Time estimate
    - [x] Shift (Default to Work Hours)
    - [x] Recurring (Default to False)
    - [x] Assignee (Default to userId=1)*/

// initially get everything from localStorage
getFromLocalStorage();

// after that addEventListener <ul> with class=taskList. Because we need to listen for click event in all delete-button and checkbox
taskList.addEventListener('click', function(event) {
  // check if the event is on checkbox
  if (event.target.type === 'checkbox') {
    // toggle the state
    toggle(event.target.parentElement.getAttribute('data-key'));
  }

  // check if that is a delete-button
  if (event.target.classList.contains('delete-button')) {
    // get id from data-key attribute's value of parent <li> where the delete-button is present
    console.log(event.target.parentElement);
    deletetask(event.target.parentElement.getAttribute('data-key'));
  }
});

