import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const SignedOutLinks = () => (
  <ul className="right">
    <li><NavLink to="/signup" data-test="signup-btn">Sign Up</NavLink></li>
    <li><NavLink to="/signin" data-test="signin-btn">Sign In</NavLink></li>
    <li><Link to="/map" className="btn">Map</Link></li>
  </ul>
);

export default SignedOutLinks;
