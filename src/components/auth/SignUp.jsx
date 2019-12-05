import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { signUp } from '../../store/actions/authActions';

const SignUp = (props) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();

  const handleChange = (setChange, e) => {
    setChange(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.signUp({
      email, password, firstName, lastName,
    });
  };

  const { authError, auth } = props;
  if (auth.uid) return <Redirect to="/" />;

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h5 className="grey-text text-darken3">Sign Up</h5>
        <label htmlFor="email">
            Email:
          <input type="email" id="email" onChange={(e) => handleChange(setEmail, e)} />
        </label>
        <label htmlFor="password">
            Password:
          <input type="password" id="password" onChange={(e) => handleChange(setPassword, e)} />
        </label>
        <label htmlFor="firstName">
            First Name:
          <input type="text" id="firstName" onChange={(e) => handleChange(setFirstName, e)} />
        </label>
        <label htmlFor="lastName">
            Last Name:
          <input type="text" id="lastName" onChange={(e) => handleChange(setLastName, e)} />
        </label>
        <button type="submit" aria-label="Sign Up" className="btn indigo darken-4">Sign Up</button>
        <div className="red-text center">
          { authError ? <p>{ authError }</p> : null }
        </div>
      </form>
    </div>
  );
};

SignUp.propTypes = {
  signUp: PropTypes.func.isRequired,
  authError: PropTypes.instanceOf(),
  auth: PropTypes.shape({
    isLoaded: PropTypes.bool.isRequired,
    isEmpty: PropTypes.bool.isRequired,
    uid: PropTypes.string,
  }).isRequired,
};

SignUp.defaultProps = {
  authError: {},
};

const mapStateToProps = (state) => ({
  auth: state.firebase.auth,
  authError: state.auth.authError,
});

const mapDispatchToProps = (dispatch) => ({
  signUp: (newUser) => dispatch(signUp(newUser)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
