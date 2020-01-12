import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Rating from 'react-rating';
import { ClipLoader } from 'react-spinners';
import { setCity } from '../../store/actions/cityActions';
import Comment from '../comment/Comment';
import { getCityById } from '../../utils/City';
import { getRankingById } from '../../utils/Ranking';

const ShowRanking = ({ match, setCityAction }) => {
  const [city, setCityState] = useState('');
  const [ranking, setRanking] = useState('');
  const [loading, setLoding] = useState(true);

  async function findCity(cityId) {
    const cityResults = await getCityById(cityId);
    if (cityResults) {
      const rankResults = await getRankingById(cityId);
      setCityState(cityResults);
      setRanking(rankResults);
      setLoding(false);
      setCityAction(cityResults);
    }
  }

  useEffect(() => {
    const cityURL = match.params;
    findCity(cityURL.id);
  }, [match.params]);

  return (
    <div className="container">
      {city && ranking
        ? (
          <div className="center white-box">
            <h1>
              {city.cityName}
              {' '}
Ranking
            </h1>
            <p className="city-ranking">
City Rating:
              {' '}
              {ranking.average - 1}
            </p>
            <Rating
              stop={7}
              readonly
              initialRating={ranking.average}
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
            <p style={{ fontSize: '2em' }}>
Total Ratings:
              {' '}
              {ranking.userRanking}
            </p>
            <Link to="/"><button type="button" aria-label="Find a City" className="btn find-btn center">Find a City</button></Link>
            <Comment
              cityStuff={city}
            />
          </div>
        )
        : (
          <div className="center white-box">
            <ClipLoader
              className="spinner"
              sizeUnit="px"
              size={150}
              color="#3B0075"
              loading={loading}
            />
          </div>
        )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.firebase.auth,
  city: state.city,
  ranking: state.ranking,
});

const mapDispatchToProps = (dispatch) => ({
  setCityAction: (city) => dispatch(setCity(city)),
});

ShowRanking.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.object,
  }).isRequired,
  setCityAction: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ShowRanking);
