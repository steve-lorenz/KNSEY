import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { signOut } from '../../store/actions/authActions'

const SignedInLinks = (props) => {

   return (
         <ul className="right">
            <li ><NavLink to='/' className='btn btn-floating'>{props.profile.initials}</NavLink></li>
            <li ><button onClick={props.signOut} className='btn'>Logout</button></li>
         </ul>
   )

}

   const mapDispatchToProps = (dispatch) => {
      return {
         signOut: () => dispatch(signOut())
      }
   }

export default connect(null, mapDispatchToProps)(SignedInLinks);