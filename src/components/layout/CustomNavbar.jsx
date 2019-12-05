import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Navbar } from 'react-materialize';
import SignedInLinks from './SignedInLinks';
import SignedOutLinks from './SignedOutLinks';

const CustomNavbar = ({ auth, profile }) => {
  const links = auth.uid ? <SignedInLinks profile={profile} /> : <SignedOutLinks />;

  return (
    <Navbar>
      <Link to="/" className="brand-logo" aria-label="Home">KNSEY</Link>
      { links }
    </Navbar>
  );
};

CustomNavbar.propTypes = {
  auth: PropTypes.shape({
    uid: PropTypes.string,
  }),
  profile: PropTypes.shape({
    role: PropTypes.number,
  }).isRequired,
};

CustomNavbar.defaultProps = {
  auth: {},
};

const mapStateToProps = (state) => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile,
  city: state.city,
  ranking: state.ranking,
});

export default connect(mapStateToProps)(CustomNavbar);
