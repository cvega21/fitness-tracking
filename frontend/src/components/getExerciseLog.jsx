import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';

const GetExerciseLog = () => {
  const [userId, setUserId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [logsLimit, setLogsLimit] = useState('');
  const [requestIsLoading, setRequestIsLoading] = useState(false);
  const [requestWasSuccessful, setRequestWasSuccessful] = useState(false);
  const [exerciseLogs, setExerciseLogs] = useState('');
  const [jsxExerciseLog, setJsxExerciseLog] = useState([]);
  
  useEffect(() => {
    if (exerciseLogs) {
      
    }
  })

  const clearValues = () => {
    setUserId('');
    setFromDate('');
    setToDate('');
    setLogsLimit('');
  }

  const handleSubmit = async () => {
    setRequestIsLoading(true);
    let logUrl = new URL('http://localhost:9000/api/exercise/log');
    let params = {'userId': userId, 'from': fromDate, 'to': toDate, 'limit': logsLimit};
    Object.keys(params).forEach(key => logUrl.searchParams.append(key, params[key]))

    let logResponse = await fetch(logUrl);
    let jsonLogResponse = await logResponse.json();
    if (logResponse.status === 200) {
      setRequestWasSuccessful(true);
      setTimeout(() => {
        setRequestWasSuccessful(false);
      }, 2000);
      clearValues();
    } else {
      alert('Someting went wrong.');
      console.error(logResponse);
    }
    setJsxExerciseLog(jsonLogResponse[0].log)
    console.log(Array.isArray(jsxExerciseLog));
    setRequestIsLoading(false);
    // let mappedResponse = jsonLogResponse[0].log.map((log) => {
    //          <li 
    //           key={log._id}
    //           value={log} />
    // })
    // setExerciseLogs(jsxExerciseLog);
    // console.log(jsonLogResponse[0].log);
    // console.log(mappedResponse);
    return logResponse
  }

  return (
    <div className="exerciseLogContainer">
      <h2>Search Your Workout History</h2>
      <div className="logInputContainer">
        <h6>Type Your User ID:</h6>
        <input
          value={userId}
          placeholder="User ID"
          onChange={e => setUserId(e.target.value)}
        />      
      </div >
      <div className="logInputContainer">
        <p>From:</p>
        <input
          type="date"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
        />    
      </div>
      <div className="logInputContainer">
        <p>To:</p>
        <input
          type="date"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
        />    
      </div>
      <div className="logInputContainer">
        <p>Limit:</p>
        <input
          type="number"
          value={logsLimit}
          placeholder="5"
          onChange={e => setLogsLimit(e.target.value)}
        />
      </div>
      <Button
        variant="dark"
        disabled={requestIsLoading}
        onClick={handleSubmit}
        >Search</Button>
      <ul className="logResponseContainer">
        {jsxExerciseLog.map((log, index) => (
            <li value={log} key={index}>{log.description}</li>
          )
        )}
      </ul>
    </div>
  )
}

export default GetExerciseLog
