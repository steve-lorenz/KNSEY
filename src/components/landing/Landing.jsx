import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Geocoder from 'react-geocoder-mapbox';
import { getCity, createCity, setCity } from '../../store/actions/cityActions';
import { getRanking } from '../../store/actions/rankActions';
import { getComments } from '../../store/actions/commentActions';
import { getCityByName } from '../../utils/City';
import { getRankingById } from '../../utils/Ranking';

const Landing = ({ history }) => {
  const [isNotRanked, setIsNotRanked] = useState(false);
  const [isInputShowing, setIsInputShowing] = useState(false);
  const [cityName, setCityName] = useState();

  useEffect(() => {
    const inputSearch = document.querySelector('.ac-box');

    inputSearch.onfocus = () => {
      setIsInputShowing(true);
    };

    inputSearch.onfocusout = () => {
      setIsInputShowing(false);
    };
  }, []);

  const handleSearhResult = async (result) => {
    const citySearchResult = result.text;
    setCityName(citySearchResult);
    const cityResults = await getCityByName(citySearchResult);
    const cityRanking = await getRankingById(cityResults.cityId);

    if (cityResults && cityRanking) {
      history.push(`/${cityResults.cityId}`);
    } else {
      setIsNotRanked(true);
      setIsInputShowing(false);
    }
  };

  const handleSuggest = (e) => {
    setCityName('');
    setIsNotRanked(false);
  };
  return (
    <div className="landing-container">
      <div className="landing-jumbotron">
        <h1 id="landing-title">KNSEY</h1>
        <p className="subtitle">See how queer friendly your city is.</p>
        <Geocoder
          inputClass="ac-box"
          resultClass="search-result"
          resultsClass="search-results"
          accessToken={process.env.REACT_APP_MAPBOX_API}
          onSelect={handleSearhResult}
          onSuggest={handleSuggest}
          focusOnMount={false}
          inputPlaceholder="Search for city..."
          types="place"
          // ref="searchInput"
        />
        { isNotRanked ? (
          <span className="no-ranking">
          Sorry,
            {' '}
            {cityName}
            {' '}
          has not been ranked yet.
          </span>
        ) : '' }
      </div>
      { !isInputShowing
        ? (
          <div className="ranking-container">
            <p className="subtitle">Rank a city using your current location.</p>
            <Link to="/create"><button type="button" aria-label="Create ranking" className="btn center"><i className="fas fa-location-arrow" /></button></Link>
          </div>
        )
        : ''}

    </div>
  );
};

Landing.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.firebase.auth,
  city: state.city,
  ranking: state.ranking,
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    getRanking, getCity, getComments, createCity, setCity,
  }, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(Landing);
