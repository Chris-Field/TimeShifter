import React, { useState, useEffect } from 'react';
import { loadTaskArray } from '../../task-array';
import { Calendar } from '../Calendar';
import { TaskDetail } from '../TaskDetail/TaskDetail';

export const App = () => {
  const [nav, setNav] = useState(0);
  const [clicked, setClicked] = useState();
  const [tasks, setTasks] = useState([]);
  const [days, setDays] = useState([]);
  const [dateDisplay, setDateDisplay] = useState('');
  const [events, setEvents] = useState(loadTaskArray());
  const [displayTaskDetail, setDisplayTaskDetail] = useState(false);

  localStorage.getItem('events')
    ? JSON.parse(localStorage.getItem('events'))
    : [];

  const eventForDate = (date) => events.find((e) => e.date === date);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  return (
    <>
      <header>
        <img
          className='logo'
          src='media/timeswitcher_logo_white_54h.png'
          alt='logo'
        />
        <input
          type='button'
          className='new-task-button'
          value='New Task'
          onClick={() => {
            setDisplayTaskDetail(true);
          }}
        ></input>
      </header>

      <div className='main'>
        <Calendar />
        {displayTaskDetail && (
          <TaskDetail
            onCancel={() => setDisplayTaskDetail(false)}
            onSave={(e) => {
              // Prevent the page from reloading when submitting the form
              e.preventDefault();
              // Add default HTML content to the HTML text editor
              // in the Notes field
              /*quill.setContents([
                { insert: 'Hello ' },
                { insert: 'World!', attributes: { bold: true } },
                { insert: '\n' },
              ]);*/

              const taskDetails = collectTaskDetailsFromForm();
              updateTaskInArray(taskDetails, taskArray, taskListHtml);
              setDisplayTaskDetail(false)
            }}
          />
        )}
      </div>
    </>
  );
};
