import React, { useState } from 'react';
import { HtmlTextEditor } from './HtmlTextEditor';

export const TaskDetail = ({ task, onSave, onCancel }) => {
  const [clicked, setClicked] = useState(false);
  const [error, setError] = useState(false);
  const [name, setName] = useState('');
  const [estTimeTillFinished, setEstTimeTillFinished] = useState('30m');

  return (
    <div className='task-detail-popup'>
      <div className='overlay'></div>
      <form className='task-detail'>
        <input
          type='text'
          name='task-name'
          id='task-name'
          value={name}
          placeholder='Task name'
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor='task-est-time-till-finished'>
          Estimated time till finished:
        </label>
        <select
          name='task-est-time-till-finished'
          id='task-est-time-till-finished'
          value={estTimeTillFinished}
          onChange={(e) => setName(e.target.value)}
          required
        >
          <option value='15m'>15 min</option>
          <option value='30m'>30 min</option>
          <option value='1h'>1 hour</option>
          <option value='2h'>2 hours</option>
          <option value='4h'>4 hours</option>
        </select>

        <div className='task-urgency'>
          <label className='task-urgency-button active'>
            <input type='radio' name='task-urgency' id='task-urgency-1' /> ASAP
          </label>
          <label className='task-urgency-button'>
            <input type='radio' name='task-urgency' id='task-urgency-2' /> Hard
            Deadline
          </label>
          <label className='task-urgency-button'>
            <input type='radio' name='task-urgency' id='task-urgency-3' /> Soft
            Deadline
          </label>
          <label className='task-urgency-button'>
            <input type='radio' name='task-urgency' id='task-urgency-4' /> No
            Deadline
          </label>
        </div>

        <div className='task-start'>
          <label htmlFor='task-start-date'>Start</label>
          <input type='date' name='task-start-date' id='task-start-date' />

          <label htmlFor='task-start-time' className='hidden task-start-time'>
            at
          </label>
          <input
            type='time'
            name='task-start-time'
            id='task-start-time'
            className='hidden task-start-time'
          />
        </div>

        <div className='task-due'>
          <label htmlFor='task-due-date'>Deadline</label>
          <input type='date' name='task-due-date' id='task-due-date' />

          <label htmlFor='task-due-time' className='hidden task-due-time'>
            at
          </label>
          <input
            type='time'
            name='task-due-time'
            id='task-due-time'
            className='hidden task-due-time'
          />
        </div>

        {HtmlTextEditor}

        <button type='button' className='cancel-button' onClick={onCancel}>
          Cancel
        </button>
        <button type='submit' className='save-button' onClick={onSave}>
          Save
        </button>
      </form>
    </div>
  );
};
