import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { signOut } from '../../store/actions/authActions';

const SignedInLinks = ({ profile, signOutAction }) => (
  <ul className="right">
    <li><NavLink to="/" className="btn btn-floating" data-test="profile-btn">{profile.initials}</NavLink></li>
    <li><button type="button" aria-label="Logout" onClick={signOutAction} data-test="logout-btn" className="btn">Logout</button></li>
    <li><Link to="/map" className="btn">Map</Link></li>
  </ul>
);

SignedInLinks.propTypes = {
  profile: PropTypes.shape({
    initials: PropTypes.string,
  }).isRequired,
  auth: PropTypes.shape({
    uid: PropTypes.string,
  }),
  signOutAction: PropTypes.func.isRequired,
};

SignedInLinks.defaultProps = {
  auth: {},
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    signOutAction: signOut,
  }, dispatch),
});

export default connect(null, mapDispatchToProps)(SignedInLinks);
