/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';

import CustomRanking from './CustomRanking';
import { getRankingByUser, createUserRanking, createCityRanking } from '../../utils/Ranking';
import { getCityByName, createCityAsync } from '../../utils/City';

const CreateRanking = ({ auth, history, profile }) => {
  const [starRating, setStarRating] = useState(0);
  const [state, setState] = useState();
  const [country, setCountry] = useState();
  const [loading, setLoading] = useState(true);
  const [ranking, setRanking] = useState(0);
  const [city, setCity] = useState({});
  const [cityName, setCityName] = useState('');
  const [coords, setCoords] = useState({});

  const getPosition = () => new Promise((res, rej) => {
    navigator.geolocation.getCurrentPosition(res, rej);
  });

  const main = async () => {
    const position = await getPosition();
    return position.coords;
  };

  const getReverseGeoCode = (coords) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.longitude},${coords.latitude}.json?types=place&access_token=pk.eyJ1IjoiZHVja21vdXRoYmVhc3QiLCJhIjoiY2pvbjliNjJ0MHNsOTN4cm9qMngzemdnMSJ9.VswQoW3vwNt8WJzbBG0FFg`;
    return new Promise(((resolve) => {
      axios.get(`${url}`)
        .then((response) => {
          if (response.statusText === 'OK') {
            const currentCity = response.data.features[0];
            return resolve(currentCity);
          }
          return Promise.error('Something went wrong!');
        })
        .catch((error) => {
          console.log(error);
        });
    }));
  };

  useEffect(() => {
    let position = null;
    let currentCity = null;
    let currentRanking = null;
    let cityDB = null;

    async function fetchCityData() {
      try {
        position = await main();
        currentCity = await getReverseGeoCode(position);
        cityDB = await getCityByName(currentCity.text);
        currentRanking = await getRankingByUser(cityDB.cityId, auth.uid);
      } catch (e) {
        console.log(e);
      }

      if (currentCity) {
        const cityList = currentCity.place_name.split(',');
        setCityName(cityList[0].trim());
        setState(cityList[1].trim());
        setCountry(cityList[2].trim());
        const longitude = currentCity.geometry.coordinates[0];
        const latitude = currentCity.geometry.coordinates[1];
        setCoords({
          latitude,
          longitude,
        });
      }

      if (cityDB) {
        setState(state);
        setCountry(country);
        setLoading(false);
        setRanking(currentRanking);
        setCity(cityDB);
      }

      const createCity = await createCityAsync({
        cityName,
        state,
        country,
        coords,
      });

      if (createCity) {
        setState(createCity.state);
        setCountry(createCity.country);
        setLoading(false);
        setCity(createCity);
      }
    }

    fetchCityData();
  }, []);

  const onClickHandler = (rating) => {
    setStarRating(rating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city) {
      alert('Sorry, KNSEY can not rank a city without your location being shared.');
    } else if (!starRating) {
      alert("You need to select a star rating, it can't be left blank");
    } else {
      const userRanking = await createUserRanking({ city, starRating }, auth.uid, profile);
      const cityRanking = await createCityRanking(city);
      if (cityRanking === 200 && userRanking) {
        history.push(`/${city.cityId}`);
      } else {
        alert('There was an error when trying to create your ranking, please try again.');
      }
    }
  };

  return (
    <div className="container white-box-container">
      { loading
        ? (
          <div className="MoonLoader center">
            <ClipLoader
              className="spinner"
              sizeUnit="px"
              size={150}
              color="#3B0075"
              loading={loading}
            />
          </div>
        )
        : city && ranking ? (
          <CustomRanking
            cityName={city.cityName}
            ranking={ranking}
            isReadOnly
            title={'You\'ve alreay ranked'}
            handleSubmit={handleSubmit}
            clickHandler={onClickHandler}
          />
        ) : (
          (
            <CustomRanking
              cityName={city.cityName}
              title="Rank your city"
              subTitle="How gay friendly is "
              handleSubmit={handleSubmit}
              ranking={starRating}
              clickHandler={onClickHandler}
            />
          )
        )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.firebase.auth,
  city: state.city,
  ranking: state.ranking,
  profile: state.firebase.profile,
});

CreateRanking.propTypes = {
  profile: PropTypes.shape({
    role: PropTypes.number,
  }).isRequired,
  auth: PropTypes.shape({
    isLoaded: PropTypes.bool.isRequired,
    isEmpty: PropTypes.bool.isRequired,
    uid: PropTypes.string,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default connect(mapStateToProps, null)(CreateRanking);
