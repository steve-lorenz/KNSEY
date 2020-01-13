import React from 'react';
import Rating from 'react-rating';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const CustomRanking = ({
  clickHandler, cityName, ranking, title, subTitle, isReadOnly, handleSubmit,
}) => (
  <div className="white-box center">
    <h1>
      {title}
      {' '}
      {!subTitle && <span className="current-city">{cityName}</span>}
    </h1>
    { subTitle
            && (
            <p className="question">
              {subTitle}
              <span className="current-city">{cityName}</span>
            </p>
            )}
    <Rating
      stop={7}
      readonly={isReadOnly}
      initialRating={ranking}
      onClick={clickHandler}
      className="ranking-icons"
      emptySymbol={[<img alt="rating 0 empty" src={require('../../assets/images/unicorn_emp_0.png')} className="icon" />,
        <img alt="rating 1 empty" src={require('../../assets/images/unicorn_emp_1.png')} className="icon" />,
        <img alt="rating 2 empty" src={require('../../assets/images/unicorn_emp_2.png')} className="icon" />,
        <img alt="rating 3 empty" src={require('../../assets/images/unicorn_emp_3.png')} className="icon" />,
        <img alt="rating 4 empty" src={require('../../assets/images/unicorn_emp_4.png')} className="icon" />,
        <img alt="rating 5 empty" src={require('../../assets/images/unicorn_emp_5.png')} className="icon" />,
        <img alt="rating 6 empty" src={require('../../assets/images/unicorn_emp_6.png')} className="icon" />]}
      fullSymbol={[<img alt="rating 0" src={require('../../assets/images/unicorn_0.png')} className="icon" />,
        <img alt="rating 1" src={require('../../assets/images/unicorn_1.png')} className="icon" />,
        <img alt="rating 2" src={require('../../assets/images/unicorn_2.png')} className="icon" />,
        <img alt="rating 3" src={require('../../assets/images/unicorn_3.png')} className="icon" />,
        <img alt="rating 4" src={require('../../assets/images/unicorn_4.png')} className="icon" />,
        <img alt="rating 5" src={require('../../assets/images/unicorn_5.png')} className="icon" />,
        <img alt="rating 6" src={require('../../assets/images/unicorn_6.png')} className="icon" />]}
    />
    <p>
      <span className="rating">
Rating :
        {' '}
        {isReadOnly ? ranking - 1 : ranking}
      </span>
    </p>
    <p> 0. Unfriendly - 6. Very Friendly</p>
    {isReadOnly
      ? <Link to="/"><button type="button" aria-label="Find a City" className="btn find-btn center">Find a City</button></Link>
      : <button type="button" aria-label="Submit" className="btn" onClick={handleSubmit}>Submit</button>}
  </div>
);

CustomRanking.propTypes = {
  ranking: PropTypes.number.isRequired,
  cityName: PropTypes.string,
  title: PropTypes.string.isRequired,
  isReadOnly: PropTypes.bool,
  subTitle: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  clickHandler: PropTypes.func.isRequired,
};

CustomRanking.defaultProps = {
  isReadOnly: false,
  subTitle: '',
  cityName: '',
};

export default CustomRanking;
