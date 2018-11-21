import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { signOut } from '../../store/actions/authActions'

const SignedInLinks = (props) => {

   return (
         <ul className="left">
            <li ><NavLink to='/' className='btn btn-floating teal darken-1'>{props.profile.initials}</NavLink></li>
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