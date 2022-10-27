import React from 'react'
import { Link } from 'react-router-dom'

function Navigation({userObj}) {
  console.log(userObj);
  return (
    <nav>
      <ul>
        <li>
          <Link to={'/'}>Home</Link>
        </li>
        <li>
          <Link to={'/profile'}>
            {userObj.displayName} 
            Profile 
            {userObj.photoURL && (
                <img src={userObj.photoURL} width="100" height="100" />
              )}</Link>
          
        </li>
      </ul>
    </nav>
  )
}

export default Navigation