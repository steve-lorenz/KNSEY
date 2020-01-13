import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { signIn } from '../../store/actions/authActions';

const SignIn = (props) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const handleChange = (setChange, e) => {
    setChange(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.signIn({ email, password });
  };

  const { authError, auth } = props;
  if (auth.uid) return <Redirect to="/" />;

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <p className="grey-text text-darken3">Sign In</p>
        <label htmlFor="email">
            Email:
          <input type="email" id="email" onChange={(e) => handleChange(setEmail, e)} />
        </label>
        <label htmlFor="password">
            Password:
          <input type="password" id="password" onChange={(e) => handleChange(setPassword, e)} />

        </label>
        <button type="submit" aria-label="Login" className="btn">Login</button>
        <div className="red-text center">
          { authError ? <p>{authError}</p> : null }
        </div>
      </form>
    </div>
  );
};

SignIn.propTypes = {
  signIn: PropTypes.func.isRequired,
  authError: PropTypes.instanceOf(),
  auth: PropTypes.shape({
    isLoaded: PropTypes.bool.isRequired,
    isEmpty: PropTypes.bool.isRequired,
    uid: PropTypes.string,
  }).isRequired,
};

SignIn.defaultProps = {
  authError: {},
};

const mapStateToProps = (state) => ({
  authError: state.auth.authError,
  auth: state.firebase.auth,
});

const mapDispatchToProps = (dispatch) => ({
  signIn: (credentials) => dispatch(signIn(credentials)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
