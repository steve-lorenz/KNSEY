import React from 'react'
import { NavLink } from 'react-router-dom'

const SignedOutLinks = () => {

   return (
      <ul>
         <li className="left"><NavLink to='/ranking'>Search</NavLink></li>
         <li className="right"><NavLink to='/signup'>Sign Up</NavLink></li>
         <li className="right"><NavLink to='/signin'>Sign In</NavLink></li> 
      </ul>
   )

}
export default SignedOutLinks;