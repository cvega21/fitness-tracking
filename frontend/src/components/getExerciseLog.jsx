import React, { useState } from 'react'
import { Button } from 'react-bootstrap';
require('dotenv').config();

const GetExerciseLog = (props) => {
  const [userId, setUserId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [logsLimit, setLogsLimit] = useState('');
  const [requestIsLoading, setRequestIsLoading] = useState(false);
  const [jsxExerciseLog, setJsxExerciseLog] = useState([]);

  const handleSubmit = async () => {
    setRequestIsLoading(true);
    let logUrl = new URL(process.env.REACT_APP_APP_PATH + '/users/' + userId + '/logs');
    let params = {'from': fromDate, 'to': toDate, 'limit': logsLimit};
    Object.keys(params).forEach(key => logUrl.searchParams.append(key, params[key]))
    let logResponse = await fetch(logUrl);
    let jsonLogResponse = await logResponse.json();

    if (logResponse.status === 200) {
      clearValues();
    } else {
      alert('Someting went wrong.');
      console.error(logResponse);
    }
    
    setJsxExerciseLog(jsonLogResponse.log);
    setRequestIsLoading(false);
    return logResponse
  }

  const clearValues = () => {
    setUserId('');
    setFromDate('');
    setToDate('');
    setLogsLimit('');
  }

  const exerciseLogTable = () => {
    jsxExerciseLog.forEach((record, index) => {
      let recordDate = new Date(record.date);
      recordDate = recordDate.toISOString().substring(0,10);
      jsxExerciseLog[index].date = recordDate;
      console.log(jsxExerciseLog[index].date)
    })
    
    let tableValues = jsxExerciseLog.map((log, index) => (
      <tr>
        <td key={index}>{log.date}</td>
        <td key={index}>{log.description}</td>
        <td key={index}>{log.duration}</td>
      </tr>
      )
    )
    

    if (jsxExerciseLog.length) {
      return (
        <table className='exerciseLogTable'>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Length</th>
          </tr>
          {tableValues}
        </table>
      )
    } 
  }

  return (
    <div className={props.className}>
      <div className='getExerciseLogContainer'>
        <h2>Search Your Workout History</h2>
        <div className='userInputContainer'>
          <label>Type Your User ID:</label>          
          <input
            value={userId}
            placeholder='User ID'
            onChange={e => setUserId(e.target.value)}
          />      
        </div>
        <div className='userInputContainer'>
          <label>From:</label>          
          <input
            type='date'
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
          />    
        </div>
        <div className='userInputContainer'>
          <label>To:</label>          
          <input
            type='date'
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            />    
        </div>
        <div className='userInputContainer'>
          <label>Limit:</label>          
          <input
            type='number'
            value={logsLimit}
            placeholder='5'
            onChange={e => setLogsLimit(e.target.value)}
          />
        </div>
        <Button
          variant='dark'
          disabled={requestIsLoading}
          onClick={handleSubmit}
        >
          Search
        </Button>
        <div>
          {exerciseLogTable()}
        </div>
      </div>
    </div>
  )
}

export default GetExerciseLog
