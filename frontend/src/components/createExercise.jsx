import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell, faBiking, faSwimmingPool, faRunning, faKeyboard, faCheck } from '@fortawesome/free-solid-svg-icons';

const CreateExercise = () => {
  const [userId, setUserId] = useState('');
  const [selectedExerciseIndex, setSelectedExerciseIndex] = useState([0,0,0,0,0]);
  const [actualExerciseType, setActualExerciseType] = useState('');
  const [customExerciseValue, setCustomExerciseValue] = useState('');
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
      }, 2000);
      clearValues();
    } else {
      alert('Someting went wrong.');
      console.error(exercisePostResponse);
    }
    setExerciseIsLoading(false);
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
      <div>
        <h6>Type your User ID:</h6>
        <input           
          value={userId}
          placeholder="User ID"
          onChange={e => setUserId(e.target.value)}
        />
      </div>
      <h6>Select Workout Type:</h6>
      <div className="workoutIcons">
        <ButtonGroup>
          <Button variant="outline-light" active={selectedExerciseIndex[0]} id="0" onClick={makeButtonActive} className="dumbbell">
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
          <Button variant="outline-light" active={selectedExerciseIndex[4]} id="4" onClick={(e) => {makeButtonActive(e); document.getElementById('customInputField').focus()} } className="other">
            <FontAwesomeIcon icon={faKeyboard} size="2x"/>
            <p>Custom</p>
            <input
              id='customInputField'
              value={customExerciseValue}
              onChange={e => setCustomExerciseValue(e.target.value)}
            />
          </Button>
        </ButtonGroup>
      </div>
      <div className='workoutBottomContainer'>
        <div>
          <h6>How long was it? (minutes)</h6>
          <input
            value={duration}
            placeholder="30"
            onChange={e => setDuration(e.target.value)}
            />
        </div>
        <div>
          <h6>When was it?</h6>
          <input 
            type="date"
            value={workoutDate}
            onChange={e => setWorkoutDate(e.target.value)}
          />
        </div>
        <Button 
          variant="dark"
          onClick={exerciseIsLoading ? null : handleSubmit}
          disabled={exerciseIsLoading}
        >
          {exerciseIsLoading ? 'Loading...' : 'Submit'}
        </Button>
        {requestWasSuccessful && 
        <div>
          <p>Success!</p>
          <FontAwesomeIcon icon={faCheck} size="2x"/>
        </div>
        }
      </div>
    </div>
  )
}

export default CreateExercise
