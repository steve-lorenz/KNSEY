import React from 'react'
import { Link } from 'react-router-dom'
import SignedInLinks from './SignedInLinks'
import SignedOutLinks from './SignedOutLinks'
import { connect } from 'react-redux'
import { Navbar } from 'react-materialize'

const CustomNavbar = (props) => {
   const { auth, profile } = props;
   const links = auth.uid ? <SignedInLinks profile={profile} /> :  <SignedOutLinks />;

   return (
      <Navbar className="nav-wrapper deep-purple darken-4">
         <Link to='/' className="brand-logo center">KNSEY</Link>
         { links }
      </Navbar>
   )

}

const mapStateToProps = (state) => {
   console.log("Nav Bar: ",state)
   return {
      auth: state.firebase.auth,
      profile: state.firebase.profile,
      city: state.city
   }
}

export default connect(mapStateToProps)(CustomNavbar)