import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateUser from './components/createUser';
import CreateExercise from './components/createExercise';
import GetExerciseLog from './components/getExerciseLog';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft, faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [activeWindowCounter, setActiveWindowCounter] = useState(0);
  const [prevActiveWindowCounter, setPrevActiveWindowCounter] = useState(0);
  const [textUnderNavigationArrows, setTextUnderNavigationArrows] = useState(['','']);

  const handleNavigation = e => {
    let navigateAction;
    
    if (e.target.className === 'nextButton' || e.target.parentNode.className === 'nextButton' || e.target.parentNode.parentNode.className === 'nextButton') {
      navigateAction = 'next';
    } else if (e.target.className === 'previousButton' || e.target.parentNode.className === 'previousButton' || e.target.parentNode.parentNode.className === 'previousButton') {
      navigateAction = 'previous';
    }
    
    if ((activeWindowCounter === 0 && navigateAction === 'previous') || (activeWindowCounter >= 2 && navigateAction === 'next')) {
      // do nothing
    } else {
      setPrevActiveWindowCounter(activeWindowCounter);
      if (navigateAction === 'previous') {
        setActiveWindowCounter(activeWindowCounter - 1);
      } else {
        setActiveWindowCounter(activeWindowCounter + 1);
      }
    }
  }
  
  useEffect(() => {
    activeWindowCounter === 0 
    ? setTextUnderNavigationArrows(['','Track Workout']) 
    : activeWindowCounter === 1
    ? setTextUnderNavigationArrows(['Create User','Workout History']) 
    : setTextUnderNavigationArrows(['Track Workout',''])
  }, [activeWindowCounter])

  return (
    <div className="AppContainer">
      <div className="App">
        <div className="appTitle">
          <h1>Fitness Tracker</h1>
          <p className="authorContainer"><b>By: <a href="https://github.com/cvega21">Christian Vega-Munguia 💪</a></b></p>
        </div>
        <div className="navigationArrowsContainer">
          {activeWindowCounter > 0 && 
          <button onClick={handleNavigation} className="previousButton" tabindex="0">
            <FontAwesomeIcon
              icon={faArrowAltCircleLeft}
              size="3x"
              />
              <h5>{textUnderNavigationArrows[0].length ? textUnderNavigationArrows[0] : ''}</h5>
          </button>
          }
          {activeWindowCounter < 2 &&
          <button onClick={handleNavigation} className="nextButton" tabindex="0">
            <FontAwesomeIcon
              icon={faArrowAltCircleRight}
              size="3x"
              />
              <h5>{textUnderNavigationArrows[1].length ? textUnderNavigationArrows[1] : ''}</h5>
          </button>
          }
        </div>
        <div className="componentContainer">
          <CreateUser className={activeWindowCounter === 0 ? 'activeWindowFromLeft' : 'leftHiddenWindow'}/>
          <CreateExercise className={(activeWindowCounter === 1 && prevActiveWindowCounter === 0) ? 'activeWindowFromRight' : (activeWindowCounter === 1 && prevActiveWindowCounter === 2) ? 'activeWindowFromLeft' : activeWindowCounter === 2 ? 'leftHiddenWindow' : 'rightHiddenWindow'}/>
          <GetExerciseLog className={activeWindowCounter === 2 ? 'activeWindowFromRight' : 'rightHiddenWindow'}/>
        </div>
      </div>
    </div>
  );
}

export default App;
