import '../App.css';
import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
require('dotenv').config();

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
    let userPostUrl = process.env.REACT_APP_APP_PATH + '/users';
    let userPostResponse = await fetch(userPostUrl, {
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
      <div className='createUserContainer'>
        <h2>Create Your Profile</h2>
        <div className='createUserFormContainer'>
          <label>Enter your name:</label>
          <input 
            name="username"
            value={user}
            placeholder='John Appleseed'
            onChange={handleChange}
          />
          <Button 
            variant='dark'
            onClick={userIsLoading ? null : handleSubmit}
            disabled={userIsLoading}
          >
            {userIsLoading ? 'Loading...' : 'Submit'}
          </Button>
        </div>
        <div>
          {userId &&     
          <div className='userIdParentContainer'>
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
                      size='lg'
                    />
                  </div>
                }
                {copiedToClipboard &&
                  <div color='green'>
                    <FontAwesomeIcon
                      icon={faCheck}
                      size='lg'
                    />
                  </div>
                }
              </div>
            </div>
            <div className='uiuxCopyUserId'>
              <p>Copy the User ID, you'll need it in the next step</p>
            </div>
          </div>
          }
        </div>
      </div>
    </div>

  )
}

export default CreateUser
