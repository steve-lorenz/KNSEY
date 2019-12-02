import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { signOut } from '../../store/actions/authActions'

const SignedInLinks = (props) => {

   return (
      <ul className="right">
         <li ><NavLink to='/' className='btn btn-floating' data-test="profile-btn">{props.profile.initials}</NavLink></li>
         <li ><button aria-label="Logout" onClick={props.signOut} data-test="logout-btn" className='btn'>Logout</button></li>
         <li ><Link to='/map' className='btn'>Map</Link></li>
      </ul>
   )

}

   const mapDispatchToProps = (dispatch) => {
      return {
         signOut: () => dispatch(signOut())
      }
   }

export default connect(null, mapDispatchToProps)(SignedInLinks);