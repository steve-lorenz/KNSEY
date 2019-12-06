import React from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'react-map-gl';
import { Link } from 'react-router-dom';

const CustomPopup = ({ city, popupInfo, closePopup }) => (
  <Popup
    tipSize={7}
    closeOnClick={false}
    anchor="bottom"
    longitude={popupInfo.coords.longitude}
    latitude={popupInfo.coords.latitude}
    offsetTop={-75}
    onClose={closePopup}
  >
    {city.cityId
      ? (
        <div>
          <h4><Link to={`/${popupInfo.cityId}`}>{popupInfo.cityName}</Link></h4>
          <p>
            {' '}
                User Average:
            {' '}
            {popupInfo.average ? (popupInfo.average - 1) : 0}
          </p>
          <p>
                Total User Rankings:
            {' '}
            {popupInfo.totalRanking ? popupInfo.totalRanking : 0}
          </p>

        </div>
      )
      : (<h4>No City Ranking Yet.</h4>)}
  </Popup>
);

CustomPopup.propTypes = {
  city: PropTypes.shape({
    cityId: PropTypes.string,
  }),
  popupInfo: PropTypes.shape({
    cityId: PropTypes.string,
    cityName: PropTypes.string,
    average: PropTypes.number,
    totalRanking: PropTypes.number,
    coords: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }),
  }).isRequired,
  closePopup: PropTypes.func.isRequired,
};

CustomPopup.defaultProps = {
  city: {},
};

export default CustomPopup;
