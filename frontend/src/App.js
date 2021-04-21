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
  let windowArray = [<CreateUser/>, <CreateExercise/>, <GetExerciseLog/>];  

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
      navigateAction === 'previous' ? setActiveWindowCounter(activeWindowCounter - 1) : setActiveWindowCounter(activeWindowCounter + 1)
    }
  }

  return (
    <div className="AppContainer">
      <div className="App">
        <div>
          <h1>Exercise Tracker</h1>
          <p>By: Christian Vega-Munguia 💪</p>
        </div>
        <div className="navigationArrowsContainer">
          {activeWindowCounter > 0 && 
          <div onClick={handleNavigation} className="previousButton">
            <FontAwesomeIcon
              icon={faArrowAltCircleLeft}
              size="3x"
              />
          </div>
          }
          {activeWindowCounter < 2 &&
          <div onClick={handleNavigation} className="nextButton">
            <FontAwesomeIcon
              icon={faArrowAltCircleRight}
              size="3x"
            />
          </div>
          }
        </div>
        <div className="componentContainer">
          {windowArray[activeWindowCounter]}
        </div>
        <div className="componentContainer">
        </div>
      </div>
    </div>
  );
}

export default App;
