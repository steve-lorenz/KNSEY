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
      <Navbar>
         <Link to='/' className="brand-logo" aria-label="Home">KNSEY</Link>
         { links }
      </Navbar>
   )

}

const mapStateToProps = (state) => {
   return {
      auth: state.firebase.auth,
      profile: state.firebase.profile,
      city: state.city,
      ranking: state.ranking
   }
}

export default connect(mapStateToProps)(CustomNavbar)