import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import confetti from '../../node_modules/canvas-confetti';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell, faBiking, faSwimmingPool, faRunning, faKeyboard, faCheck } from '@fortawesome/free-solid-svg-icons';
require('dotenv').config();

const CreateExercise = (props) => {
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
    let exerciseUrl = process.env.REACT_APP_APP_PATH + '/users/' + userId + '/exercises';

    let exercisePostResponse = await fetch(exerciseUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'description': finalExerciseValue, 'date': workoutDate, 'duration': duration})
    })
    if (exercisePostResponse.status === 200) {
      setRequestWasSuccessful(true);
      setTimeout(() => {
        setRequestWasSuccessful(false);
      }, 3000);
      clearValues();
      confetti({
        spread: 180
      });
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
    <div className={props.className}>
      <div className='createExerciseContainer'>
        <h1>Track A Workout</h1>
        <div className='userInputContainer'>
          <label>Type your User ID:</label>
          <input           
            value={userId}
            placeholder='User ID'
            onChange={e => setUserId(e.target.value)}
            />
        </div>
        <div className='workoutIcons'>
          <label>Select Workout Type:</label>
          <ButtonGroup className='workoutIconsButtonGroup'>
            <Button variant='outline-dark' active={selectedExerciseIndex[0]} id='0' onClick={makeButtonActive} className='gym'>
              <FontAwesomeIcon icon={faDumbbell} size='2x' className='workoutIcon'/>
              <h2>Gym</h2>
            </Button>
            <Button variant='outline-dark' active={selectedExerciseIndex[1]} id='1' onClick={makeButtonActive} className='biking'>
              <FontAwesomeIcon icon={faBiking} size='2x' className='workoutIcon'/>
              <h2>Biking</h2>
            </Button>
            <Button variant='outline-dark' active={selectedExerciseIndex[2]} id='2' onClick={makeButtonActive} className='swimming'>
              <FontAwesomeIcon icon={faSwimmingPool} size='2x' className='workoutIcon'/>
              <h2>Swimming</h2>
            </Button>
            <Button variant='outline-dark' active={selectedExerciseIndex[3]} id='3' onClick={makeButtonActive} className='running'>
              <FontAwesomeIcon icon={faRunning} size='2x' className='workoutIcon'/>
              <h2>Running</h2>
            </Button>
            <Button variant='outline-dark' active={selectedExerciseIndex[4]} id='4' className='other' onClick={(e) => {makeButtonActive(e); document.getElementById('customInputField').focus()} } >
              <div className='customExerciseButton'>
                <FontAwesomeIcon icon={faKeyboard} size='2x' className='workoutIcon'/>
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
        <div className='userInputContainer'>
          <label>How many minutes?</label>
          <input
            type='number'
            value={duration}
            placeholder='Number of Minutes (e.g. 30)'
            onChange={e => setDuration(e.target.value)}
            />
        </div>
        <div className='userInputContainer'>
          <label>When was it?</label>          
          <input 
            type='date'
            value={workoutDate}
            onChange={e => setWorkoutDate(e.target.value)}
          />
        </div>
        <div className='userInputContainer'>
          <Button 
            variant='dark'
            onClick={exerciseIsLoading ? null : handleSubmit}
            disabled={exerciseIsLoading}
          >
            {exerciseIsLoading ? 'Loading...' : 'Submit'}
          </Button>
        </div>
        {requestWasSuccessful && 
        <div>
          <FontAwesomeIcon icon={faCheck} size='4x' color='lightgreen'/>
          <p>Success!</p>
        </div>
        }
      </div>
    </div>
  )
}

export default CreateExercise
