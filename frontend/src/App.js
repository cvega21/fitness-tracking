import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateUser from './components/createUser';
import CreateExercise from './components/createExercise';
import GetExerciseLog from './components/getExerciseLog';
import React, { useState } from 'react';


function App() {
  const [activeWindow, setActiveWindow] = useState(0);

  // things to fix: add component navigation keys, custom workout value not being in state, exercise logs only displaying name

  return (
    <div className="AppContainer">
      <div className="App">
        <div>
          <h1>Exercise Tracker</h1>
          <p>By: Christian Vega-Munguia 💪</p>
        </div>
        <div className="componentContainer">
          <CreateUser/>
          <CreateExercise/>
          <GetExerciseLog/>
        </div>
      </div>
    </div>
  );
}

export default App;
