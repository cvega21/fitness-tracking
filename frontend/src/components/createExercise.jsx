import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell } from '@fortawesome/free-solid-svg-icons';
import { faBiking } from '@fortawesome/free-solid-svg-icons';
import { faSwimmingPool } from '@fortawesome/free-solid-svg-icons';
import { faRunning } from '@fortawesome/free-solid-svg-icons';
import { faKeyboard } from '@fortawesome/free-solid-svg-icons';

const CreateExercise = () => {
  const [selectedExerciseType, setSelectedExerciseType] = useState('');

  const handleSubmit = async () => {
    // asynchronous send 
    // send user to
    let userPostResponse = await fetch("http://localhost:9000/api/exercise/add", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })
    let jsonResponse = (await userPostResponse).json();
    alert('hi!');
  }
  
  useEffect(() => {
    
  })

  return (
    <div className="createExerciseContainer">
      <h3>Track A Workout</h3>
      <div>
        <h6>Type your User ID:</h6>
        <input placeholder="123456789asdf"></input>
      </div>
      <div className="workoutIcons">
        <h6>Select Workout Type:</h6>
        <button>
          <FontAwesomeIcon icon={faDumbbell} size="2x"/>
        </button>
        <button>
          <FontAwesomeIcon icon={faBiking} size="2x"/>
        </button>
        <button>
          <FontAwesomeIcon icon={faSwimmingPool} size="2x"/>
        </button>
        <button>
          <FontAwesomeIcon icon={faRunning} size="2x"/>
        </button>
        <button>
          
          <FontAwesomeIcon icon={faKeyboard} size="2x"/>
        </button>
      </div>
      <div>
        <h6>How long was it?</h6>
        <input placeholder="30 (minutes)"></input>
        <Button variant="dark" onClick={handleSubmit}>Submit</Button>
      </div>

    </div>
  )
}

export default CreateExercise
