import { schedule } from './scheduleTasks.js';
import { renderTaskList } from './script.js';

/** 
 * @param {number} [id]
 * @param {string} [name]
 * @param {Date} [startDateTime]
 * @param {Date} [dueDateTime]
 * @param {string} [urgency]
 * @param {string} [estTimeTillFinished]
 * @param {string} [shift]
 * @param {boolean} [recurring]
 * @param {number} [assignee]
 * @param {object} [notes]
 * @param {boolean} [completed]
 * @param {object} [workTimePlanned]
 * @param {number} [parent]
*/
export class Task {
  constructor(id, name, startDateTime, dueDateTime, urgency, estTimeTillFinished, shift, recurring, assignee, notes, completed, workTimePlanned, parent) {
    this.id = id ? id : Date.now();
    this.name = name ? name : '';
    this.startDateTime = startDateTime ? startDateTime : new Date(new Date().setHours(0, 0, 0, 0));
    this.dueDateTime = dueDateTime ? dueDateTime : new Date(new Date().setHours(23, 59, 0, 0));
    this.urgency = urgency ? urgency : 'task-urgency-3';
    this.estTimeTillFinished = estTimeTillFinished ? estTimeTillFinished : '30m';
    this.shift = shift ? shift : 'Work hours';
    this.recurring = recurring ? recurring : false;
    this.assignee = assignee ? assignee : 1;
    this.notes = notes ? notes : quill.getContents();
    this.completed = completed ? completed : false;
    // Hidden fields
    this.workTimePlanned = workTimePlanned ? workTimePlanned : null;
    this.parent = parent ? parent : null;
  };

  
  getMatchingTaskIndex(taskList) {
    const taskIndexInArray = taskList.findIndex(element => element.id == this.id);
    return taskIndexInArray;
  }

  
  /**
   * Save the task details in database
   * @param {object} task - The task to save
   * @param {array} taskList - Full list of all tasks
   */
  saveTask(taskList) {
    if (this === null) { return }
    
    // Check if task already exists.
    // If so, update details.
    // Otherwise add it to tasks array.
    const taskIndex = this.getMatchingTaskIndex(taskList);
    if (taskIndex > -1) {
      console.log("Saving task detail for existing task: ");
      console.log(this);
      this.updateTask(taskIndex, taskList);
    } else {
      console.log("Saving task detail for new task: ");
      console.log(this);
      taskList.push(this);
    }
  
    schedule(taskList);
  
    // Update task list on screen and update local storage
    renderTaskList(taskList);
    this.saveToLocalStorage(taskList);
  
  }
  
  updateTask(taskIndex, taskList) {
    // Update task details
    taskList[taskIndex] = this;
    // Update localstorage
    this.saveToLocalStorage(taskList);
  }

  saveToLocalStorage(taskList) {
    // convert the array to string then store it.
    localStorage.setItem('tasks', JSON.stringify(taskList));
  }

  // Deletes the task from tasks array,
  // then updates localstorage 
  // and renders updated list to screen
  deleteTask() {
    id = this.id;
    // filters out the <li> with the id and updates the tasks array
    TASKS = TASKS.filter(function() {
      // Use != not !==, because here types are different:
      // number vs. string.
      return this.id != id;
    });
  
    // update the localStorage
    saveToLocalStorage(TASKS);
    // render them to screen
    renderTaskList(TASKS);
  }
}



