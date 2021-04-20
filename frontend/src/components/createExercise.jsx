import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import confetti from '../../node_modules/canvas-confetti';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell, faBiking, faSwimmingPool, faRunning, faKeyboard, faCheck } from '@fortawesome/free-solid-svg-icons';

const CreateExercise = () => {
  const [userId, setUserId] = useState('');
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState([0,0,0,0,0]);
  const [actualExerciseType, setActualExerciseType] = useState('');
  const [customExerciseValue, setCustomExerciseValue] = useState('hello');
  const [duration, setDuration] = useState('');
  const [workoutDate, setWorkoutDate] = useState('');
  const [exerciseIsLoading, setExerciseIsLoading] = useState(false);
  const [requestWasSuccessful, setRequestWasSuccessful] = useState(false);

  const clearValues = () => {
    setUserId('');
    setSelectedExerciseIndex([0,0,0,0,0]);
    setActualExerciseType('');
    setCustomExerciseValue('');
    setDuration('');
    setWorkoutDate('');
  }

  const handleSubmit = async () => {
    setExerciseIsLoading(true);
    let today = new Date().toISOString();
    let finalExerciseValue = actualExerciseType;
    if (!workoutDate) setWorkoutDate(today);
    if (customExerciseValue) finalExerciseValue = customExerciseValue

    let exercisePostResponse = await fetch("http://localhost:9000/api/exercise/add", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'userId': userId, 'description': finalExerciseValue, 'date': workoutDate, 'duration': duration})
    })
    if (exercisePostResponse.status === 200) {
      setRequestWasSuccessful(true);
      setTimeout(() => {
        setRequestWasSuccessful(false);
      }, 3000);
      clearValues();
    } else {
      alert('Someting went wrong.');
      console.error(exercisePostResponse);
    }
    setExerciseIsLoading(false);
    confetti({
      spread: 180
    });
    return exercisePostResponse
  }
  
  useEffect(() => {
    if (actualExerciseType !== 'other' && customExerciseValue) {
      setCustomExerciseValue('');
    }
  }, [customExerciseValue, actualExerciseType])

  const makeButtonActive = (e) => {
    let updatedSelect = [0,0,0,0,0];
    updatedSelect[e.currentTarget.id] = 1;
    setSelectedExerciseIndex(updatedSelect);
    setActualExerciseType(e.currentTarget.className.split(' ')[0]);
  }

  return (
    <div className="createExerciseContainer">
      <h2>Track A Workout</h2>
      
      <div className="userInputContainer">
        <h6>Type your User ID:</h6>
        <input           
          value={userId}
          placeholder="User ID"
          onChange={e => setUserId(e.target.value)}
        />
      </div>
      <div className="workoutIcons">
        <h6>Select Workout Type:</h6>
        <ButtonGroup className="workoutIconsButtonGroup">
          <Button variant="outline-light" active={selectedExerciseIndex[0]} id="0" onClick={makeButtonActive} className="gym">
            <FontAwesomeIcon icon={faDumbbell} size="2x"/>
            <p>Gym</p>
          </Button>
          <Button variant="outline-light" active={selectedExerciseIndex[1]} id="1" onClick={makeButtonActive} className="biking">
            <FontAwesomeIcon icon={faBiking} size="2x"/>
            <p>Biking</p>
          </Button>
          <Button variant="outline-light" active={selectedExerciseIndex[2]} id="2" onClick={makeButtonActive} className="swimming">
            <FontAwesomeIcon icon={faSwimmingPool} size="2x"/>
            <p>Swimming</p>
          </Button>
          <Button variant="outline-light" active={selectedExerciseIndex[3]} id="3" onClick={makeButtonActive} className="running">
            <FontAwesomeIcon icon={faRunning} size="2x"/>
            <p>Running</p>
          </Button>
          <Button variant="outline-light" active={selectedExerciseIndex[4]} id="4" className="other" onClick={(e) => {makeButtonActive(e); document.getElementById('customInputField').focus()} } >
            <div className="customExerciseButton">
              <FontAwesomeIcon icon={faKeyboard} size="2x"/>
              <input
                placeholder='custom'
                id='customInputField'
                value={customExerciseValue}
                onChange={e => setCustomExerciseValue(e.target.value)}
              />
            </div>
          </Button>
        </ButtonGroup>
      </div>
      <div className="userInputContainer">
        <h6>How many minutes?</h6>
        <input
          type='number'
          value={duration}
          placeholder="30"
          onChange={e => setDuration(e.target.value)}
          />
      </div>
      <div className="userInputContainer">
        <h6>When was it?</h6>
        <input 
          type="date"
          value={workoutDate}
          onChange={e => setWorkoutDate(e.target.value)}
        />
      </div>
      <div className="userInputContainer">
        <Button 
          variant="dark"
          onClick={exerciseIsLoading ? null : handleSubmit}
          disabled={exerciseIsLoading}
        >
          {exerciseIsLoading ? 'Loading...' : 'Submit'}
        </Button>
      </div>
      {requestWasSuccessful && 
      <div>
        <FontAwesomeIcon icon={faCheck} size="4x" color="lightgreen"/>
        <p>Success!</p>
      </div>
      }
    </div>
  )
}

export default CreateExercise
