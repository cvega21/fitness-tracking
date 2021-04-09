import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell } from '@fortawesome/free-solid-svg-icons';
import { faBiking } from '@fortawesome/free-solid-svg-icons';
import { faSwimmingPool } from '@fortawesome/free-solid-svg-icons';
import { faRunning } from '@fortawesome/free-solid-svg-icons';
import { faKeyboard } from '@fortawesome/free-solid-svg-icons';

const CreateExercise = () => {
  const handleSubmit = async () => {
    // asynchronous send 
    // send user to
    let userPostResponse = await fetch("http://localhost:9000/api/exercise/new-user", {
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
  
  return (
    <div className="createExerciseContainer">
      <h3>Track A Workout</h3>
      <div className="workoutIcons">
        <h6>Select Workout Type:</h6>
        <button>
          <FontAwesomeIcon icon={faDumbbell}/>
        </button>
        <button>
          <FontAwesomeIcon icon={faBiking}/>
        </button>
        <button>
          <FontAwesomeIcon icon={faSwimmingPool}/>
        </button>
        <button>
          <FontAwesomeIcon icon={faRunning}/>
        </button>
        <button>
          <FontAwesomeIcon icon={faKeyboard}/>
        </button>
      </div>
      <h6>How long was it?</h6>
      <input placeholder="30 (minutes)"></input>
      <Button variant="danger" onClick={handleSubmit}>Submit</Button>
    </div>
  )
}

export default CreateExercise
