import React, { useState, useEffect } from 'react'
import path from 'path'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const CreateUser = () => {
  const [user, setUser] = useState('');
  const [userIsLoading, setUserIsLoading] = useState(false);
  const [userId, setUserId] = useState('');

  const handleChange = (e) => {
    setUser(e.target.value)
  }

  const handleSubmit = () => {
    setUserIsLoading(true); 
  }
  
  const getUserFromDB = async () => {
    let userPostResponse = await fetch("http://localhost:9000/api/exercise/new-user", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username: user})
    })
    let jsonResponse = await userPostResponse.json();
    setUserId(`Your User ID is: ${jsonResponse._id}`);
    return jsonResponse
  }
  
  useEffect(() => {
    if (userIsLoading) {
      getUserFromDB().then(() => {
        setUserIsLoading(false); 
      })
    }
  })

  return (
    <div className="createUserContainer">
      <h3>Create Your Profile</h3>
      <div className="createUserFormContainer">
        <FontAwesomeIcon icon={faUserCircle} size="2x"/>
        <input 
          value={user}
          placeholder="Enter your name"
          onChange={handleChange}
        />
        <Button 
          variant="dark"
          onClick={userIsLoading ? null : handleSubmit}
          disabled={userIsLoading}
        >
          {userIsLoading ? 'Loading...' : 'Submit'}
        </Button>
      </div>
      <div>
        <p></p>
        <p>{userId}</p>
      </div>      
    </div>
  )
}

export default CreateUser
