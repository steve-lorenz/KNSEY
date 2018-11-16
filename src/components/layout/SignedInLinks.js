import React from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { signOut } from '../../store/actions/authActions'

const SignedInLinks = (props) => {

   return (
      <ul className="right">
         <li><NavLink to='/'>Search</NavLink></li>
         <li><NavLink to='/'>Rank</NavLink></li>
         <li><button onClick={props.signOut} className='btn'>Logout</button></li>
         <li><NavLink to='/' className='btn btn-floating teal darken-1'>SL</NavLink></li>
      </ul>
   )

}

   const mapDispatchToProps = (dispatch) => {
      return {
         signOut: () => dispatch(signOut())
      }
   }

export default connect(null, mapDispatchToProps)(SignedInLinks);