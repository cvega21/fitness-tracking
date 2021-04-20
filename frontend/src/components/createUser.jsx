import React, { useState, useEffect } from 'react'
import path from 'path'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faClipboard } from '@fortawesome/free-regular-svg-icons';

const userIdOnSuccess = (userId) => {
  const copyUserId = () => {
    navigator.clipboard.writeText(userId);
    setTimeout(() => {
      console.log('hi')
    },2500);
  }
  
  return (
    <div className={'userIdResponseContainer'}>
      <div>
        <p><b>Your UserID is: </b>{userId}</p>
      </div>
      <div id={'userIdClipboard'} onClick={navigator.clipboard.writeText(userId)}>
        <FontAwesomeIcon
          icon={faClipboard}
          size="2x"
        />
        <p>copy to clipboard</p>
      </div>
    </div>    
  )
}

const CreateUser = (props) => {
  const [user, setUser] = useState('');
  const [userIsLoading, setUserIsLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

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
    setUserId(jsonResponse._id);
    return jsonResponse
  }
  
  useEffect(() => {
    if (userIsLoading) {
      getUserFromDB().then(() => {
        setUserIsLoading(false); 
      })
    }
  })

  const copyUserId = () => {
    setCopiedToClipboard(true);
    navigator.clipboard.writeText(userId);
    setTimeout(() => {
      setCopiedToClipboard(false);
    },2000);
  }

  return (
    <div className={props.className}>
      <div className="createUserContainer">
        <h2>Create Your Profile</h2>
        <div className="createUserFormContainer">
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
          {userId &&     
          <div className='userIdResponseContainer'>
            <div>
              User ID:
            </div>
            <div>
              {userId}
            </div>
            <div className='copyToClipboardContainer' onClick={copyUserId}>
              {!copiedToClipboard &&
                <div>
                  <FontAwesomeIcon
                    icon={faCopy}
                    size="lg"
                  />
                </div>
              }
              {copiedToClipboard &&
                <div color='green'>
                  <FontAwesomeIcon
                    icon={faCheck}
                    size="lg"
                  />
                </div>
              }
            </div>
          </div>}
        </div>
      </div>
    </div>

  )
}

export default CreateUser
