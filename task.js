/** 
 * @param {object} [taskDetails] - The details desired to apply to the task
 * @param {number} [taskDetails.id]
 * @param {string} [taskDetails.name]
 * @param {Date} [taskDetails.startDateTime]
 * @param {Date} [taskDetails.dueDateTime]
 * @param {string} [taskDetails.urgency]
 * @param {string} [taskDetails.estTimeTillFinished]
 * @param {string} [taskDetails.shift]
 * @param {boolean} [taskDetails.recurring]
 * @param {number} [taskDetails.assignee]
 * @param {object} [taskDetails.notes]
 * @param {boolean} [taskDetails.completed]
 * @param {object} [taskDetails.workTimePlanned]
 * @param {number} [taskDetails.parent]
*/
export class Task {
  constructor(taskDetails) {
    // Create an empty object if taskDetails is not provided
    if (!taskDetails) { taskDetails = {} };

    // Set some default values for each field if nothing is set
    this.id = taskDetails.id ? taskDetails.id : Date.now();
    this.name = taskDetails.name ? taskDetails.name : '';
    this.startDateTime = taskDetails.startDateTime ? taskDetails.startDateTime : new Date(new Date().setHours(0, 0, 0, 0));
    this.dueDateTime = taskDetails.dueDateTime ? taskDetails.dueDateTime : new Date(new Date().setHours(23, 59, 0, 0));
    this.urgency = taskDetails.urgency ? taskDetails.urgency : 'task-urgency-3';
    this.estTimeTillFinished = taskDetails.estTimeTillFinished ? taskDetails.estTimeTillFinished : '30m';
    this.shift = taskDetails.shift ? taskDetails.shift : 'Work hours';
    this.recurring = taskDetails.recurring ? taskDetails.recurring : false;
    this.assignee = taskDetails.assignee ? taskDetails.assignee : 1;
    this.notes = taskDetails.notes ? taskDetails.notes : quill.getContents();
    this.completed = taskDetails.completed ? taskDetails.completed : false;
    // Hidden fields
    this.workTimePlanned = taskDetails.workTimePlanned ? taskDetails.workTimePlanned : null;
    this.parent = taskDetails.parent ? taskDetails.parent : null;
  };

  
  getMatchingTaskIndex(taskArray) {
    const taskIndexInArray = taskArray.findIndex(element => element.id == this.id);
    return taskIndexInArray;
  }

  
  // toggle the value to completed and not completed
  toggleChecked() {
    // toggle the value
    this.completed = !this.completed;
  }
}



