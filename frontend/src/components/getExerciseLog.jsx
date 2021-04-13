import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';

const GetExerciseLog = () => {
  const [userId, setUserId] = useState('');
  const [userIsLoading, setUserIsLoading] = useState(false);

  const handleChange = (e) => {
    console.log(e.target.value)
    setUserId(e.target.value)
  }
  
  useEffect(() => {
    if (userIsLoading) {

    }
  })

  return (
    <div className="exerciseLogContainer">
      <h3>Search Your Workout History</h3>
      <input value={userId} placeholder="Enter your name" onChange={handleChange}></input>
      <p>From:</p>
      <input type="date"></input>
      <p>To:</p>
      <input type="date"></input>
      <p></p>
      <Button
        variant="dark"
        disabled={userIsLoading}
        >Search</Button>
    </div>
  )
}

export default GetExerciseLog
